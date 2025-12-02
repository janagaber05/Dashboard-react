<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dashboard</title>
    <link rel="stylesheet" href="../pages/layout.css" />
    <link rel="stylesheet" href="../components/nav.css" />
  </head>
  <body>
    <button class="menu-toggle" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="backdrop"></div>
    <!-- Icons: add your files under public/components/icons/ and keep these src paths -->
    <aside class="sidebar">
      <div class="profile">
        <img class="avatar" src="../logo192.png" alt="Profile" />
        <div class="name">Jana Gaber</div>
        <div class="email">Janagaber9201@gmail.com</div>
      </div>

      <nav class="nav">
        <a class="nav-item active" href="#home">Home</a>
        <a class="nav-item" href="#projects">Projects</a>
        <a class="nav-item" href="#skills">Skills</a>
        <a class="nav-item" href="#experience">Experience</a>
        <a class="nav-item" href="./category.html">Categories</a>
        <a class="nav-item" href="./messages.html">Messages</a>
        <a class="nav-item" href="./settings.html">Settings</a>
        <a class="nav-item" href="#logout">Log-Out</a>
      </nav>
    </aside>

    <main class="content">
      <section class="cards-grid">
        <article class="card">
          <header class="card-header">
            <h3>Messages Card</h3>
            <p class="sub"><img class="icon-s" src="../icons/mail.svg" alt="Mail" /> 12,000 Messages Unread</p>
          </header>
          <div class="card-chart">
            <svg class="mini-chart" viewBox="0 0 160 90" preserveAspectRatio="none" data-values="8,10,12,9,13,16,14,18,22,20"></svg>
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h3>Most Viewed</h3>
            <p class="sub"><img class="icon-s" src="../icons/star.svg" alt="Star" /> 12,000 Viewers</p>
          </header>
          <div class="card-media">
            <svg class="mini-chart" viewBox="0 0 160 90" preserveAspectRatio="none" data-values="5,6,7,9,8,10,12,14,15,17"></svg>
            <img class="phone-photo" src="" alt="Phone Preview (add your image src here)" />
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h3>Project Views</h3>
            <p class="sub"><img class="icon-s" src="../icons/folder.svg" alt="Folder" /> 12,000 Viewers</p>
          </header>
          <div class="card-chart">
            <svg class="mini-chart" viewBox="0 0 160 90" preserveAspectRatio="none" data-values="6,7,9,12,11,13,15,17,16,19"></svg>
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h3>Visitors</h3>
            <p class="sub"><img class="icon-s" src="../icons/eye.svg" alt="Eye" /> 12,000 Visitor</p>
          </header>
          <div class="card-chart">
            <svg class="mini-chart" viewBox="0 0 160 90" preserveAspectRatio="none" data-values="10,9,11,14,12,15,18,21,23,22"></svg>
          </div>
        </article>
      </section>

      <section class="performance card-wide">
        <header class="card-header">
          <h3>Category Performance</h3>
        </header>
        <div class="rows">
          <div class="row">
            <span class="label">Graphic Design</span>
            <div class="bar" data-value="30"><span></span></div>
            <span class="pct">30%</span>
          </div>
          <div class="row">
            <span class="label">Web Design</span>
            <div class="bar" data-value="40"><span></span></div>
            <span class="pct">40%</span>
          </div>
          <div class="row">
            <span class="label">App Design</span>
            <div class="bar" data-value="80"><span></span></div>
            <span class="pct">80%</span>
          </div>
          <div class="row">
            <span class="label">3D</span>
            <div class="bar" data-value="70"><span></span></div>
            <span class="pct">70%</span>
          </div>
        </div>
      </section>

      <section class="activity card-wide">
        <header class="card-header">
          <h3>Recent Activity</h3>
        </header>
        <ul class="activity-list">
          <li>
            <span>Updated Zoo Website</span>
            <time>10 min ago</time>
          </li>
          <li>
            <span>Added 3D Project</span>
            <time>1 hour ago</time>
          </li>
          <li>
            <span>Edited Profile Picture</span>
            <time>Yesterday</time>
          </li>
        </ul>
      </section>
    </main>

    <script src="../components/nav.js"></script>
    <script src="../pages/layout.js"></script>
  </body>
</html>


