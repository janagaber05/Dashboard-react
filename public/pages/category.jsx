<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Categories</title>
    <link rel="stylesheet" href="../pages/layout.css" />
    <link rel="stylesheet" href="../components/nav.css" />
    <link rel="stylesheet" href="../pages/category.css" />
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
        <a class="nav-item active" href="./category.html">Categories</a>
        <a class="nav-item" href="./messages.html">Messages</a>
        <a class="nav-item" href="./settings.html">Settings</a>
        <a class="nav-item" href="#logout">Log-Out</a>
      </nav>
    </aside>

    <main class="content">
      <section class="category-card">
        <div class="tabs">
          <button class="tab active" data-panel="cat">Category</button>
          <button class="tab" data-panel="tags">Tags</button>
          <button class="tab" data-panel="pages">Pages</button>
        </div>

        <form class="cat-form" id="cat-form">
          <div class="field">
            <label>Name</label>
            <input type="text" placeholder="Name" />
          </div>
          <div class="field">
            <label>Name/AR</label>
            <input type="text" placeholder="Name in Arabic" />
          </div>
          <div class="field">
            <label>Meta Tag</label>
            <input type="text" placeholder="keywords, design, web, ..." />
          </div>
          <div class="field">
            <label>Meta Tag/AR</label>
            <input type="text" placeholder="arabic keywords ..." />
          </div>

          <div class="field col">
            <label>Content:</label>
            <div class="editor">
              <div class="toolbar">
                <button type="button" data-cmd="bold" title="Bold">B</button>
                <button type="button" data-cmd="italic" title="Italic">I</button>
                <button type="button" data-cmd="underline" title="Underline">U</button>
                <button type="button" data-cmd="insertUnorderedList" title="Bullet list">•</button>
                <button type="button" data-cmd="createLink" title="Link">🔗</button>
                <button type="button" data-cmd="insertImage" title="Image">🖼</button>
                <span class="mode">Paragraph</span>
              </div>
              <div class="wys" contenteditable="true" data-placeholder="Write content here..."></div>
            </div>
          </div>

          <div class="field col">
            <label>Content/AR:</label>
            <div class="editor">
              <div class="toolbar">
                <button type="button" data-cmd="bold" title="Bold">B</button>
                <button type="button" data-cmd="italic" title="Italic">I</button>
                <button type="button" data-cmd="underline" title="Underline">U</button>
                <button type="button" data-cmd="insertUnorderedList" title="Bullet list">•</button>
                <button type="button" data-cmd="createLink" title="Link">🔗</button>
                <button type="button" data-cmd="insertImage" title="Image">🖼</button>
                <span class="mode">Paragraph</span>
              </div>
              <div class="wys" contenteditable="true" dir="auto" data-placeholder="اكتب المحتوى هنا..."></div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn">Save</button>
            <button type="button" class="btn ghost">Preview</button>
            <button type="button" class="btn danger">Delete</button>
          </div>
        </form>
      </section>

      <section class="cat-list card-wide">
        <div class="cat-table">
          <div class="thead">
            <div class="th">Type</div>
            <div class="th">Name</div>
            <div class="th">Description</div>
            <div class="th">Action</div>
          </div>
          <div id="cat-tbody" class="tbody"></div>
        </div>

        <div class="pager">
          <button class="pg-btn pg-first" aria-label="First page">«</button>
          <div class="pg-pages" id="cat-pages"></div>
          <button class="pg-btn pg-next" aria-label="Next page">»</button>
        </div>
        <div class="pager-meta" id="cat-meta"></div>
      </section>
    </main>

    <script src="../components/nav.js"></script>
    <script src="../components/richtext.js"></script>
    <script src="../pages/category.js"></script>
  </body>
  </html>


