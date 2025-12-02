<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Messages</title>
    <link rel="stylesheet" href="../pages/layout.css" />
    <link rel="stylesheet" href="../components/nav.css" />
    <link rel="stylesheet" href="../pages/messages.css" />
  </head>
  <body>
    <button class="menu-toggle" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="backdrop"></div>

    <aside class="sidebar">
      <div class="profile">
        <img class="avatar" src="../logo192.png" alt="Profile" />
        <div class="name">Jana Gaber</div>
        <div class="email">Janagaber9201@gmail.com</div>
      </div>

      <nav class="nav">
        <a class="nav-item" href="./dashboard.html#home">Home</a>
        <a class="nav-item" href="#projects">Projects</a>
        <a class="nav-item" href="#skills">Skills</a>
        <a class="nav-item" href="#experience">Experience</a>
        <a class="nav-item" href="./category.html">Categories</a>
        <a class="nav-item active" href="./messages.html">Messages</a>
        <a class="nav-item" href="./settings.html">Settings</a>
        <a class="nav-item" href="#logout">Log-Out</a>
      </nav>
    </aside>

    <main class="content">
      <section class="messages-card card-wide">
        <header class="card-header">
          <h3>Messages</h3>
        </header>

        <div class="msg-toolbar">
          <label class="radio">
            <input type="radio" name="filter" value="unread" checked />
            <span><i class="dot"></i> Un Read</span>
          </label>
          <label class="radio">
            <input type="radio" name="filter" value="read" />
            <span><i class="ring"></i> Read</span>
          </label>

          <div class="stats">
            <span class="pill" id="stat-total">Total 0</span>
            <span class="pill" id="stat-new">New 0</span>
            <span class="pill" id="stat-read">Read 0</span>
          </div>
        </div>

        <div class="table">
          <div class="thead">
            <div class="th">Name</div>
            <div class="th">Email</div>
            <div class="th">Subject</div>
            <div class="th">Date</div>
            <div class="th">Status</div>
            <div class="th">Action</div>
          </div>
          <div id="tbody" class="tbody"></div>
        </div>

        <div class="pager">
          <button class="pg-btn pg-first" aria-label="First page">«</button>
          <div class="pg-pages" id="pg-pages"></div>
          <button class="pg-btn pg-next" aria-label="Next page">»</button>
        </div>
        <div class="pager-meta" id="pager-meta"></div>
      </section>
    </main>

    <script src="../components/nav.js"></script>
    <script src="../pages/layout.js"></script>
    <script src="../pages/messages.js"></script>
  </body>
  </html>


