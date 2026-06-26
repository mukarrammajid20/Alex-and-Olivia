export const isServerlessReadOnlyFilesystem = (): boolean =>
  process.env.VERCEL === "1" ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.NETLIFY);
