# MVP to Prodution AI

## 1) Production-ready RAG
In this tutorial, we implemented a RAG app that can connect and sync to different file storage, document, and CRM integrations.

Once synced, our RAG chatbot could search across documents while respecting the native permissions of the data source - that means if you don't have access to a google drive file, you won't be able to retrieve context from that file.
Lastly Managed Sync webhooks ensure that record updates are captured.

## 2) Permissions Deep Dive
In our second chapter, we deep dive into different permissions strategies for enforcing access control in a RAG pipeline.

Our RAG application is using a managed graph database to check relationships between users and file IDs.
Access control is done post-retrieval, meaning the check is done after vector embeddings are retrieved from our 
vector DB.
