declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_LOCALSTORAGE_TOKEN_KEY: string;
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY : string;
    RECAPTCHA_SECRET_KEY : string
  }
}

