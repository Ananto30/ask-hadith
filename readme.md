<p align="center">
 <h2 align="center">Ask Hadith</h2>
 <p align="center">
     <a href="https://www.askhadith.com/">
     askhadith.com
     </a>
     <br>
 🔎 Hadith search engine powered by <a href="https://docs.atlas.mongodb.com/atlas-search/">Atlas Search</a></p>
 <p align="center">
  <a href="https://img.shields.io/github/license/Ananto30/ask-hadith">
     <img alt="License" src="https://img.shields.io/github/license/Ananto30/ask-hadith" />
  </a>
  <a href="https://depfu.com/github/Ananto30/ask-hadith?project_id=13555">
     <img alt="Depfu status" src="https://badges.depfu.com/badges/362ce5396653b2bd131b26c55bb809c6/overview.svg" />
  </a>
  <br>
  <a href="https://codeclimate.com/github/Ananto30/ask-hadith/maintainability">
     <img src="https://api.codeclimate.com/v1/badges/9c222616b7ecc1db1e54/maintainability" />
  </a>
  <a href="https://app.codacy.com/gh/Ananto30/ask-hadith/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade">
     <img src="https://app.codacy.com/project/badge/Grade/b9167b05884743ab90703bc7ecbc740b"/>
  </a>
 </p>
</p>

## Technologies 📱

*   **Vercel**: For serverless functions (in Go) to search and get hadiths.
*   **MongoDB Atlas**: Database and search engine.
*   **Svelte**: Web app (Frontend).
*   **Netlify**: Web deployment.
*   **TailwindCSS**: Styling.

## Features ⭐

*   Search Hadiths by anything (full text search).
*   Search hadith by book name and number, like `bukhari 1029`. (currently has some issues)
*   Bookmark hadith (local storage).
*   Install as PWA.
*   Copy and share hadith.

## Development 🧑‍💻

*   Web (Svelte)

<!---->

    cd web
    npm install
    npm run dev

*   Serverless functions (Go)

<!---->

    npm i -g vercel
    vercel dev

Test the api `/api/search?search=cat`

## Support 🙋

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ananto30)
