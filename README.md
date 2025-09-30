# 🍽️ FullStack Restaurant App 

This is a **Full Stack Restaurant Application** built with **ASP.NET Core (Backend)** and **React + TypeScript (Frontend)**.  
It allows users to browse the menu, add food items to cart, register/login, and place orders.  

---

## 🚀 Features  

### ✅ User Side (Frontend)  
-  Homepage with featured food items  
-  View menu with categories  
-  Add items to cart and checkout  
-  User authentication (Register/Login)  
-  User Profile
### 🚧 Future (Planned Features)  
-  Admin dashboard for product & ingredient management  
-  Order tracking  


---

## 🛠️ Tech Stack  

### Frontend  
- ⚛️ React + TypeScript  
- 🎨 TailwindCSS + ShadCN UI  
- 🌐 Axios for API calls  
- 📦 Context API for cart management  

### Backend  
- ⚙️ ASP.NET Core Web API  
- 🗄️ Entity Framework Core  
- 🔑 Identity for authentication & authorization  
- 💾 SQL Server database  

---

## 📂 Project Structure  
FullStackRestaurantApp/
│
├── Backend/ # ASP.NET Core API
│ ├── Controllers/ # API endpoints
│ ├── Models/ # Database models
│ ├── DTOs/ # Data transfer objects
│ ├── Data/ # DbContext & migrations
│
├── Frontend/ # React + TypeScript
│ ├── src/
│ │ ├── components/ # UI Components
│ │ ├── Pages/ # App Pages
│ │ ├── Context/ # Cart & Auth Context
│ │ └── api.ts # API config
│ └── public/
│
└── README.md


---

## ⚡ Getting Started  

### Backend Setup  
1. Navigate to backend folder:  
   ```bash
   cd Backend/TequliesResturent
Update database:

dotnet ef database update


Run the backend:

dotnet run

Frontend Setup

Navigate to frontend folder:

cd Frontend


Install dependencies:

npm install


Start the app:

npm run dev

🎯 Future Improvements

👩‍💻 Admin panel for managing menu, ingredients, and users

📦 Order tracking system

💳 Payment gateway integration

👩‍💻 Author

Developed by Iqra Yasmeen 😉
🚀 Learning full-stack development by building real-world projects.
