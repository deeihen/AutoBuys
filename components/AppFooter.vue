<template>
  <footer id="help">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <h3>AutoBuys</h3>
          <p>Vehicles on the shelf. Robots on demand.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            <li><NuxtLink to="/shop">All products</NuxtLink></li>
            <li><NuxtLink to="/#factions">Factions</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Your account</h3>
          <ul>
            <li><NuxtLink to="/orders">Orders</NuxtLink></li>
            <li><NuxtLink to="/login">Log in</NuxtLink></li>
            <li><NuxtLink to="/register">Register</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>School demo store</h3>
          <p>Mock checkout only. No payment is taken and nothing is shipped.</p>
        </div>
      </div>
      <p class="legal">
        AutoBuys is not affiliated with or endorsed by Hasbro. Transformers and
        related names are trademarks of their respective owners.
      </p>
    </div>
  </footer>
</template>
