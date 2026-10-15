-- Sample PHP prices; artwork is abstract, not an official product photo.
-- Re-running seed leaves existing stock untouched.
insert into public.products (id, name, price, faction, category, description, stock, featured) values
('prime-flagship', 'Optimus Prime', 3499.00, 'Autobot', 'Figure', 'Flagship edition. A cab-over truck that converts to a robot in 24 steps. Includes two accessories and a display card.', 15, true),
('bee-scout', 'Bumblebee', 1399.00, 'Autobot', 'Figure', 'Classic scout. A compact car that converts in 12 steps. A good first figure for new fans.', 25, true),
('mega-warlord', 'Megatron', 3799.00, 'Decepticon', 'Figure', 'Warlord edition. Die-cast accents, articulated hands and a removable cannon.', 12, true),
('star-skyfire', 'Starscream', 2699.00, 'Decepticon', 'Figure', 'Skyfire edition. Fold-out wings and a poseable robot mode. Includes two missiles.', 18, true),
('sound-comms', 'Soundwave', 2999.00, 'Decepticon', 'Figure', 'Comms pack. Converts from a boombox-style vehicle and includes three mini companion figures.', 10, false),
('iron-guard', 'Ironhide', 2199.00, 'Autobot', 'Figure', 'Heavy guard. A sturdy pickup with ratchet joints and dual cannons.', 20, false),
('grim-dino', 'Grimlock', 3299.00, 'Autobot', 'Figure', 'Dino command. Converts between a dinosaur and a robot. Features an opening jaw and swinging tail.', 8, false),
('kit-prime', 'Optimus Prime model kit', 1899.00, 'Autobot', 'Model Kit', 'Snap-fit, no glue. Around 150 parts on colored runners. Includes a simple trimming tool.', 16, true),
('kit-mega', 'Megatron model kit', 1899.00, 'Decepticon', 'Model Kit', 'Snap-fit kit with a poseable robot mode. Currently out of stock.', 0, false),
('matrix', 'Matrix of Leadership', 4899.00, 'Autobot', 'Display Gear', 'Display replica. A light-up core on a velvet-lined stand.', 5, false),
('stand', 'Universal display stand', 1099.00, 'Neutral', 'Display Gear', 'Adjustable arm. A weighted base holds figures in mid-transformation poses.', 30, true),
('display-case', 'Collector display case', 1599.00, 'Neutral', 'Display Gear', 'Clear acrylic case protects a favorite figure from dust.', 20, false)
on conflict (id) do update set
  name = excluded.name, price = excluded.price, faction = excluded.faction,
  category = excluded.category, description = excluded.description, featured = excluded.featured;
