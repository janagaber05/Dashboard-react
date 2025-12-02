<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Settings</title>
    <link rel="stylesheet" href="../pages/layout.css" />
    <link rel="stylesheet" href="../components/nav.css" />
    <link rel="stylesheet" href="../pages/settings.css" />
  </head>
  <body>
    <button class="menu-toggle" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div class="backdrop"></div>

    <aside class="sidebar">
      <div class="profile">
        <img class="avatar" id="side-avatar" src="../logo192.png" alt="Profile" />
        <div class="name">Jana Gaber</div>
        <div class="email">Janagaber9201@gmail.com</div>
      </div>

      <nav class="nav">
        <a class="nav-item" href="./dashboard.html#home">Home</a>
        <a class="nav-item" href="#projects">Projects</a>
        <a class="nav-item" href="#skills">Skills</a>
        <a class="nav-item" href="#experience">Experience</a>
        <a class="nav-item" href="./category.html">Categories</a>
        <a class="nav-item" href="./messages.html">Messages</a>
        <a class="nav-item active" href="./settings.html">Settings</a>
        <a class="nav-item" href="#logout">Log-Out</a>
      </nav>
    </aside>

    <main class="content">
      <section class="settings-card">
        <div class="settings-header">
          <img id="profile-preview" class="profile-preview" src="../logo192.png" alt="Profile" />
          <div class="photo-actions">
            <button id="btn-photo" class="link-button">✎ Edit Profile Picture</button>
            <button id="btn-remove-photo" class="link-button danger" aria-label="Remove photo">
              <img src="../icons/trash.svg" alt="Remove" class="icon-s" />
            </button>
          </div>
          <input id="file-photo" type="file" accept="image/*" hidden />
        </div>

        <form id="settings-form" class="form">
          <div class="field">
            <label>Name:</label>
            <input id="name" type="text" placeholder="Your full name" />
          </div>
          <div class="field">
            <label>Job :</label>
            <input id="job" type="text" placeholder="Your title(s)" />
          </div>
          <div class="field">
            <label>Bio:</label>
            <textarea id="bio" rows="4" placeholder="Tell us about yourself"></textarea>
          </div>

          <div class="grid-2">
            <div class="field">
              <label>Instagram:</label>
              <input id="instagram" type="url" placeholder="URL..." />
            </div>
            <div class="field">
              <label>Facebook:</label>
              <input id="facebook" type="url" placeholder="URL..." />
            </div>
            <div class="field">
              <label>TikTok:</label>
              <input id="tiktok" type="url" placeholder="URL..." />
            </div>
            <div class="field">
              <label>LinkedIn:</label>
              <input id="linkedin" type="url" placeholder="URL..." />
            </div>
            <div class="field">
              <label>Behance:</label>
              <input id="behance" type="url" placeholder="URL..." />
            </div>
          </div>

          <div class="actions">
            <button type="button" id="btn-save">Save</button>
            <button type="button" id="btn-reset" class="secondary">Reset</button>
          </div>
        </form>
      </section>
    </main>

    <script src="../components/nav.js"></script>
    <script src="../pages/settings.js"></script>
  </body>
  </html>


