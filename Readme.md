# Vercel Clone 
>[!IMPORTANT]
Deployment requires setting up a s3 object store

### Setup Guide

This Project contains following services and folders:

- `vercel`: contains files to clone and upload the gitrepo to S3 object store
- `vercel_deployment`: Builds the gitrepo and saves the assets to s3 object store
- `request_handler`: serves the files after deployment

### Local Setup

1. Setup your S3 object store
2.  Setup `.env.local` variables in each of the modules which contains the S3 access keys and Port numbers  
3. Ensure that Docker daemon is running in the device.
4. Run `npm install` in all the 3 services 
5. Run `node index.js` in `vercel`,`vercel_deployment` and `request_handler`
6. Finally deploy the frontend and you are good to go! 

At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `vercel`       | `:3000` |
| 2    | `request_handler` | `:3001` |

