# Project Requirements and Organization

## Requirements
Your product must meet the following requirements:

### 1. **Develop a Web-Based Application**
- The application should be built using **JavaScript, HTML, and CSS**.
- It must run in **Google Chrome** without requiring extensions.
- **React.js** is the recommended frontend framework, but alternative JavaScript-based solutions are allowed.

### 2. **Host Online with PostgreSQL Using AWS**
- The application must connect to an **AWS server** and a **PostgreSQL database** (previously used in Project 2).
- Modifications to the **database schema** and **seed data** are allowed.
- **Node.js** and **Express.js** are the recommended backend technologies, but alternatives such as **PHP, Flask, Django, Ruby on Rails, or Spring Boot** may be used.

### 3. **Serve Different Types of Users or Views**
- The application must accommodate different user roles.
- Mobile apps are **not required**, as all users are in-store.
- Interface types based on team size:
  - **Teams of 3+**:
    - **Managers**: Desktop conventional interface
    - **Cashiers**: Point-of-sales (POS) system interface
    - **Customers**: Self-service kiosk interface
  - **Teams of 5+**:
    - **Menu Boards**: Non-interactive large multi-display interface
  - **Teams of 6**:
    - **Kitchen Staff**: Kitchen display interface

### 4. **Make Use of External APIs**
- The application must integrate with external APIs for expanded functionality:
  - **Teams of 3+**:
    - **User Authentication**: (e.g., Google OAuth2)
    - **Machine Translation**: (e.g., Google Translate)
    - **Weather Service**: (e.g., OpenWeather)
  - **Teams of 6**:
    - **Team's Choice**: One additional external API, subject to instructor approval.

### 5. **Ensure Accessibility Compliance**
- The application must comply with **WCAG 2.1** accessibility standards.
- The **customer interface** must be fully accessible to all required user personas.

### 6. **Deploy and Maintain the Application by Sprint 1**
- The application must remain deployed and regularly updated throughout the project.
- Failure to maintain deployment may result in penalization.

### 7. **Utilize GitHub for Version Control**
- The repository must use **GitHub** for version control and team collaboration.

### 8. **Go Beyond Basic Requirements**
- The application must include **non-trivial thematic functionality** beyond a basic restaurant POS system.
- Thematic functionality requirements:
  - **(n - 3)** thematic functionalities for a team of **n** members.
  - Example themes:
    - **Nutritional and allergen alerts**
    - **Preferences-driven order placement**
    - **Dynamic menu pricing**
    - **Voice-driven order placement**
    - **Service-based chatbot**
    - **Customer-driven menu item review aggregator**
    - **Custom functionality (requires instructor approval)**

### 9. **[Honors Only] Implement a Restaurant Loyalty Program**
- Support for **reward progress and redemptions**.
- **Discounted and reward offerings** for loyalty program members.
- **Personalized deals and alerts** based on ordering history.
- **Member-specific interface login and visual cues**.

---

## Presentation and Demo
Your final product will be presented at the end of the semester.

### **Final Presentation**
- Presented to **instructors, TAs, and classmates**.
- Show the **evolution of the product**, from initial design to deployment.
- Convince stakeholders to continue funding.

### **Technical Demo**
- Conducted with **TAs**.
- Focus on **backend development and system functionality**.
- Demonstrate how the application meets or exceeds project requirements.