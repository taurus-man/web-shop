# web-shop

### table of contents
1. Setup and installation
2. Frontend Features
3. Documentation


### 1. Setup and installation
- clone the git repository
- start the server:
    - cd server
    - npm install
    - setup the database:
        - input the desired database information inside .env (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)
        - cd setup
        - node create_database.js
        - node create_table.js
        - node import_products.js 
        - cd ..
    - node server.js

- start frontend app:
    - cd client/web-shop-client
    - npm install
    - npm run dev

### 2. Frontend Features
- SignUp (/signup)
- SignIn (/signin)
- View Products (/)
- View extended product information (/products/:id) by clicking on the item on the home page or on the Cart page
- Add a product to the Cart on the product information page (/products/:id) by clicking on the button "Add to Cart"
    - if the product is already in the Cart "Go to Cart" button will show, which takes the user to the Cart page (/cart)
- User can also view Cart (/cart) by clicking on the Cart icon on the top right corner of the Navigation bar
- On the Cart page (/cart) all products in the Cart can be viewed (name, image, price, quantity, total product price, and the total price of all products)
    - Each product can have its quantity increased or decreased
    - Each product can be removed from the Cart


### 3. Documentatin

#### Project Overview
The project's goal was to develop a web shop application showcasing products and enabling user interaction through functionalities like product browsing, cart management, and user authentication. This documentation outlines the architectural decisions, design considerations, and implementation strategies employed.

#### Architectural Decisions
Backend Architecture: Chose Node.js with Express.js for its non-blocking I/O, which ensures efficient handling of multiple simultaneous requests, making it suitable for a web shop application where numerous users interact with the product inventory and cart functionalities concurrently.

Frontend Architecture: Implemented Next.js to leverage server-side rendering for faster page loads, enhancing SEO and improving user experience. Next.js's file-based routing and built-in API routes simplify the project structure and streamline the development process.

Database Selection: MySQL was selected for its robustness, scalability, and widespread use in e-commerce platforms. It efficiently manages relational data, like user accounts, product inventories, and shopping carts, providing a solid foundation for complex queries and transactions.

Styling Approach: Utilized Tailwind CSS for its utility-first approach, enabling rapid UI development without sacrificing maintainability. Tailwind's responsive design utilities facilitated the implementation of a responsive and visually appealing interface aligning with the provided UI designs.

#### Design Considerations
User Authentication: Implemented a user authentication system using jsonwebtoken (JWT) and bcryptjs. JWT facilitates secure transmission of user credentials, while bcryptjs hashes passwords, enhancing security. The authentication system supports sign-up, sign-in, and session management, ensuring a secure user experience.

Middleware Integration: Developed custom middlewares, requireLogin and requireAdmin, to protect routes based on authentication status and user roles. This approach ensures that sensitive functionalities, like cart manipulation and product management, are accessible only to authenticated users or administrators.

Database Schema: Designed a normalized database schema to efficiently store and retrieve data. Relationships between users, products, and carts are carefully modeled to support the application's functionality while ensuring data integrity and facilitating future scalability.

#### Implementation Strategies
State Management: To handle global state management efficiently, the application leverages React's Context API in conjunction with useReducer hooks. This approach allows for a more structured and maintainable state management system, centralizing the state logic for user authentication and cart functionalities. It enables components to access and manipulate global state without prop drilling, enhancing code readability and component reusability.

Responsive UI Implementation: The responsive design was a priority, achieved through Tailwind CSS's mobile-first utilities. The application adjusts seamlessly across devices, ensuring a consistent and accessible user experience.

Security Measures: Focused on secure authentication mechanisms and implemented best practices like password hashing and token-based authentication to protect user accounts and data.

Testing and Scalability: Adopted Jest for testing, aiming for comprehensive coverage to ensure the application's reliability. The test suite covers critical functionalities, validating both the backend logic and frontend components.

#### Challenges Faced
State Management: Managing global state for cart data across different components was challenging. The solution involved using React context and custom hooks to share cart state and logic efficiently.

Responsive Design Implementation: Ensuring the UI's responsiveness while closely adhering to the provided designs required meticulous adjustment of Tailwind CSS utilities.

#### Justification of Technology Selections
Node.js and Express.js: Chosen for their efficiency in handling asynchronous operations, making them ideal for web applications with real-time data processing needs.

Next.js: Selected for its benefits in SEO, performance, and developer experience, especially for projects requiring rapid development and deployment.

MySQL: Opted for its reliability in handling complex data relationships, which is crucial for e-commerce applications.

Tailwind CSS: The utility-first approach significantly accelerates development time without compromising on design fidelity or responsiveness.

Jest: Its simplicity and wide adoption in the JavaScript community make it a solid choice for testing React applications.

#### Conclusion
This project represents a comprehensive approach to building a modern, secure, and user-friendly web shop application. Each technology and design pattern was chosen with consideration of the project's requirements and goals. The implementation demonstrates a balance between performance, security, and usability, showcasing a scalable solution suitable for real-world e-commerce platforms.

