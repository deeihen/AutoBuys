-- Run once in Supabase SQL Editor before seed.sql.
create table public.products (
  id text primary key,
  name text not null,
  price numeric(12,2) not null check (price >= 0),
  faction text not null check (faction in ('Autobot', 'Decepticon', 'Neutral')),
  category text not null check (category in ('Figure', 'Model Kit', 'Display Gear')),
  image_url text not null default '',
  description text not null default '',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (length(trim(name)) between 1 and 120),
  email text not null check (length(email) between 3 and 254),
  address text not null check (length(trim(address)) between 1 and 1000),
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  quantity integer not null check (quantity between 1 and 100),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  unique (order_id, product_id)
);
create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy "Everyone reads products" on public.products for select to anon, authenticated using (true);
create policy "Owners read orders" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "Owners read order items" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = (select auth.uid()))
);
create policy "Guests and owners insert orders" on public.orders for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy "Checkout inserts items" on public.order_items for insert to anon, authenticated with check (true);

-- Everyone inserts through place_order, which validates prices and ownership.
-- Revoke direct writes so clients cannot attach items to another order.
revoke all on public.products, public.orders, public.order_items from anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.orders, public.order_items to authenticated;

-- Guests get a confirmation without receiving permission to read guest orders.
-- An exception rolls back the order, its items, and all stock changes.
create or replace function public.place_order(
  customer_name text, customer_email text, customer_address text, cart_items jsonb,
  request_id uuid
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  entry jsonb;
  product public.products%rowtype;
  existing public.orders%rowtype;
  order_total numeric(12,2) := 0;
  quantity_value integer;
begin
  if request_id is null then raise exception 'Missing checkout request ID.'; end if;
  -- Serialize retries. A random request UUID serves as a private guest receipt key.
  perform pg_advisory_xact_lock(hashtextextended(request_id::text, 0));
  select * into existing from public.orders where id = request_id;
  if found then
    if existing.user_id is distinct from auth.uid() then raise exception 'This request belongs to another session.'; end if;
    return jsonb_build_object('id', existing.id, 'total', existing.total);
  end if;
  if customer_name is null or length(trim(customer_name)) not between 1 and 120
    or customer_address is null or length(trim(customer_address)) not between 1 and 1000
    or customer_email is null or length(customer_email) > 254
    or customer_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a name, valid email, and full address.';
  end if;
  if cart_items is null or jsonb_typeof(cart_items) <> 'array' then raise exception 'Invalid cart.'; end if;
  if jsonb_array_length(cart_items) not between 1 and 100 then raise exception 'Cart must contain 1 to 100 products.'; end if;
  if exists (
    select 1 from jsonb_array_elements(cart_items) as entries(value)
    group by value->>'product_id' having count(*) > 1
  ) then raise exception 'Duplicate products in cart.'; end if;
  insert into public.orders (id, user_id, name, email, address, total)
    values (request_id, auth.uid(), trim(customer_name), trim(customer_email), trim(customer_address), 0);
  -- Stable lock order avoids overselling and deadlocks between different carts.
  for entry in select value from jsonb_array_elements(cart_items) order by value->>'product_id' loop
    if jsonb_typeof(entry) <> 'object' or entry->>'quantity' is null
      or entry->>'quantity' !~ '^[1-9][0-9]{0,2}$' then raise exception 'Invalid quantity.'; end if;
    quantity_value := (entry->>'quantity')::integer;
    if quantity_value > 100 then raise exception 'Maximum quantity is 100 per product.'; end if;
    select * into product from public.products where id = entry->>'product_id' for update;
    if not found then raise exception 'A product is no longer available. Update your cart.'; end if;
    if product.stock < quantity_value then raise exception 'Not enough stock for %. Update your cart.', product.name; end if;
    insert into public.order_items (order_id, product_id, quantity, unit_price)
      values (request_id, product.id, quantity_value, product.price);
    update public.products set stock = stock - quantity_value where id = product.id;
    order_total := order_total + product.price * quantity_value;
  end loop;
  update public.orders set total = order_total where id = request_id;
  return jsonb_build_object('id', request_id, 'total', order_total);
end;
$$;
revoke all on function public.place_order(text, text, text, jsonb, uuid) from public;
grant execute on function public.place_order(text, text, text, jsonb, uuid) to anon, authenticated;
