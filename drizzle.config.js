/** @type {import("drizzle-kit").Config} */
export default{
    schema: "./configs/schema.jsx",
    dialect : 'postgresql',
    dbCredentials : {
        url : "postgresql://neondb_owner:rb7JgAGiy4SC@ep-snowy-block-a5zonir7.us-east-2.aws.neon.tech/neondb?sslmode=require",
    }
}