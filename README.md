# QUIZ AI

Create a quiz game with AI



https://github.com/ritwickrajmakhal/quizai/assets/100060023/6f027bfd-d79b-4ebd-bf09-dd1afcdac9f2



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

- Node.js and npm (https://nodejs.org/en/)
- Gemini API Key (https://aistudio.google.com/app/apikey)
- Strapi API Key (https://docs.strapi.io/user-docs/settings/API-tokens)
    - Make sure you have already setup [quizai backend](https://github.com/ritwickrajmakhal/quizai-backend)
- Hugging Face API Key (https://huggingface.co/settings/tokens)
- Google Client ID (https://blog.logrocket.com/guide-adding-google-login-react-app/)

### Installing

A step by step series of examples that tell you how to get a development env running

```
git clone https://github.com/ritwickrajmakhal/quizai.git
cd quizai
npm install
```

### Create a .env file in the root of the project and add the following

```
REACT_APP_GEMINI_API_KEY=
REACT_APP_STRAPI_API_URL=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_SECRET_KEY=
REACT_APP_STRAPI_API_KEY=
REACT_APP_HUGGING_FACE_API_KEY=
```

### Run the project

```
npm start
```

## Built With

- [React](https://reactjs.org/) - The web framework used
- [Strapi](https://strapi.io/) - The headless CMS used
- [Gemini](https://docs.gemini.com/rest-api/) - Generative AI
- [Hugging Face](https://huggingface.co/) - The NLP API used
- [Google](https://developers.google.com/identity/sign-in/web/sign-in) - The authentication API used
