The ft_transcendence project at 42 Ecole is a full-stack web application where the backend is powered by Django and PostgreSQL for efficient data storage and management. The project also leverages Docker for containerization, ensuring that the development environment is consistent and scalable.
Backend Components:

    Django Framework: Used to manage user authentication, friend system, real-time communication, and database interactions. Django’s powerful ORM helps in managing the PostgreSQL database, ensuring smooth CRUD operations and efficient querying.
    PostgreSQL: A relational database used to store user data, chat history, friend requests, and more. It provides robust support for complex queries and transactions.
    Docker: Docker is employed to containerize both the Django backend and PostgreSQL database, simplifying deployment and scalability. Each service runs in its own container, ensuring that dependencies are isolated and the environment is reproducible across different setups.
    Nginx: Nginx serves as a reverse proxy for the application, directing HTTP and WebSocket traffic to the correct services. It also ensures secure communication by handling SSL certificates for both HTTP (https://) and WebSocket (wss://) protocols, securing the real-time interactions between users.

WebSocket Communication:

    WebSocket is integrated into the project to provide real-time messaging between users. Nginx handles the WebSocket upgrade requests and proxies them to the Django application. This allows for live chat interactions with minimal latency.

Frontend solution

    Vanilla JavaScript and Nginx

Deployment:

    Docker Compose: The project is managed using Docker Compose, which allows the orchestration of multiple containers for the frontend, backend, and database. This simplifies the development process by creating a reproducible environment.
    Nginx Configuration: Nginx is configured to proxy both HTTP and WebSocket connections, making the application accessible over secure protocols (HTTPS and WSS). It handles load balancing and manages the routing of traffic to the appropriate containers.
