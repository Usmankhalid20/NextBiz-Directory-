# NextBiz - Business Directory Platform

A comprehensive, full-stack web application built with **Next.js 16**, designed to manage and display local business listings. NextBiz offers a seamless experience for users to discover businesses and a powerful dashboard for administrators to manage content, users, and analytics.

---

## 🚀 Key Features

### 🌍 Public Directory (User Experience)

- **Dynamic Listing Grid**: Browse businesses with a clean, responsive card layout.
- **Interactive Map View**: visualize all business locations on an interactive map using `Leaflet`.
- **Real-Time Search**: Instantly filter businesses by name, category, or description.
- **Smart Filtering**: Sort by "Open Now", "Top Rated", or "Review Count".
- **Detailed Profiles**: Dedicated pages for each business showing operating hours, contact details, website links, and location data.
- **Mobile Optimized**: Fully responsive design that works perfectly on phones, tablets, and desktops.

### 🛡️ Admin Dashboard (Management)

- **Analytics Overview**: Visual stats on total businesses, active listings, user growth, and review metrics.
- **CRUD Operations**: Full Create, Read, Update, and Delete capabilities for businesses.
  - _Soft Delete_: Hide businesses without losing data.
  - _Hard Delete_: Permanently remove records.
  - _Restore_: Recover accidentally deleted businesses.
- **Bulk Log Management**: View audit logs to track who changed what and when.
- **User Management**: Oversee registered users and manage their access roles.
- **Secure Access**: Protected routes that only allow authorized personnel.

### 🔐 Security & Authentication

- **JWT Authentication**: Secure, stateless authentication using JSON Web Tokens.
- **HTTP-Only Cookies**: Prevents XSS attacks by storing tokens securely.
- **Role-Based Access Control (RBAC)**: Strict separation between `User` and `Admin` permissions.
- **Middleware Protection**: Edge-compatible middleware (`proxy.ts`) protects sensitive routes and APIs.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - The React Framework for the Web.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
- **Maps**: [React Leaflet](https://react-leaflet.js.org/) - Open-source maps.
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library.

### Backend

- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data schemas.
- **ODM**: [Mongoose](https://mongoosejs.com/) - Elegant object modeling for Node.js.
- **Auth**: `jsonwebtoken` & `jose` - Industry standard for secure tokens.
- **Audit**: Custom logging system to track admin actions.

---

## 📂 Project Structure

Here's a high-level overview of the codebase:

```bash
/
├── app/                  # Next.js App Router (File-based routing)
│   ├── (public)/         # Public routes (Home, Business Details)
│   ├── admin/            # Protected Admin Dashboard routes
│   ├── api/              # Backend API Endpoints (REST)
│   ├── login/            # Authentication Interface
│   └── layout.tsx        # Root layout (Metadata, Fonts, Providers)
├── components/           # Reusable UI Components
│   ├── admin/            # Admin-specific components (Tables, Headers)
│   └── BusinessCard.jsx  # Card component for listing businesses
├── lib/                  # Utility functions & Database connection
│   ├── mongodb.js        # Mongoose connection handler
│   └── audit.js          # Activity logging utility
├── models/               # Mongoose Schemas (Data Models)
│   ├── Business.js       # Business Listing Schema
│   └── User.js           # User & Auth Schema
├── context/              # React Context Providers
│   └── AuthContext.js    # Global authentication state
└── middleware.ts         # Request interceptor for route protection
```

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

1.  **Node.js**: Version 18.17 or higher.
2.  **MongoDB**: A running instance (Local or MongoDB Atlas).

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/nextbiz.git
    cd nextbiz
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory. You can use `.env.example` as a reference.

    ```env
    # .env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/business-app
    JWT_SECRET=your_super_secret_random_string_at_least_32_chars
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4.  **Run the Development Server**:

    ```bash
    npm run dev
    ```

5.  **View the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### Logging In

- **Admin**: Use your admin credentials to access `/admin/dashboard`. You will be automatically redirected there upon login.
- **User**: Standard users are redirected to the homepage `/` to browse businesses.

### Managing Businesses (Admin)

1.  Navigate to the **Admin Dashboard**.
2.  Click **"Add Business"** to create a new listing.
3.  Fill in the details (Name, Category, Location, etc.).
4.  Use the **Table View** to Edit, Delete, or Restore businesses.

### Search & Filter

- Use the search bar on the homepage to find businesses by name or description.
- Click the "Map View" icon to switch to the map interface.
- Use the dropdown filters to narrow down by category or status.

---

## 🚢 Deployment

This project is optimized for deployment on **Vercel**, the creators of Next.js.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add your **Environment Variables** (`MONGODB_URI`, `JWT_SECRET`) in the Vercel Project Settings.
4.  Deploy! Vercel will automatically build and serve your application.

---

## 🤝 Contributing

Contributions are welcome!

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
