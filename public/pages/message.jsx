<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Message</title>
    <link rel="stylesheet" href="../pages/layout.css" />
    <link rel="stylesheet" href="../components/nav.css" />
    <link rel="stylesheet" href="../pages/message.css" />
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
      <section class="message-card">
        <div class="row">
          <div class="label">Name:</div>
          <div class="value" id="m-name">-</div>
        </div>
        <div class="row">
          <div class="label">Email:</div>
          <div class="value" id="m-email">-</div>
        </div>
        <div class="row two">
          <div><span class="label">Date:</span> <span class="value" id="m-date">-</span></div>
          <div class="at"><span>At</span> <span id="m-time">10:29 PM</span></div>
        </div>
        <hr />
        <div class="row">
          <div class="label">Subject:</div>
          <div class="value" id="m-subject">-</div>
        </div>
        <div class="row col">
          <div class="label">Message:</div>
          <div class="value" id="m-body">
            Hi, I loved your portfolio and I’d like you to design a website for my bakery. Please contact me…
          </div>
        </div>
        <div class="actions">
          <button id="btn-read">Mark as Read</button>
          <button id="btn-reply">Reply</button>
          <button id="btn-delete" class="danger">Delete</button>
        </div>
      </section>
    </main>

    <script src="../components/nav.js"></script>
    <script src="../pages/message.js"></script>
  </body>
  </html>


