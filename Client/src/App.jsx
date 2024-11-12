import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MatrixPage from './pages/MatrixPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/matrix" element={<MatrixPage />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import DashboardPage from './pages/DashboardPage';
// import { EditExperimentPage } from './pages/EditExperimentPage';
// import { RunExperimentPage } from './pages/RunExperimentPage';
// import { SettingsPage } from './pages/SettingsPage';
// import { UsersPage } from './pages/UsersPage';
// import { DocumentationPage } from './pages/DocumentationPage';

// //protect routes
// // const ProtectedRoute = ({ children }) => {
// //     // Add your authentication logic here
// //     const isAuthenticated = true; // Replace with actual auth check
    
// //     if (!isAuthenticated) {
// //         return <Navigate to="/login" />;
// //     }
    
// //     return children;
// // };

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 {/* Public routes */}
//                 <Route 
//                     path="/login" 
//                     element={<div>Login Page</div>} // Replace with actual login page
//                 />

//                 {/* Protected routes */}
//                 <Route
//                     path="/"
//                     element={
//                         <ProtectedRoute>
//                         <DashboardPage />
//                         </ProtectedRoute>
//                     }
//                 />
                
//                 <Route
//                     path="/edit"
//                     element={
//                         <ProtectedRoute>
//                         <EditExperimentPage />
//                         </ProtectedRoute>
//                     }
//                 />
                
//                 <Route
//                     path="/run"
//                     element={
//                         <ProtectedRoute>
//                         <RunExperimentPage />
//                         </ProtectedRoute>
//                     }
//                 />

//                 {/* Manage routes */}
//                 <Route
//                     path="/manage/settings"
//                     element={
//                         <ProtectedRoute>
//                         <SettingsPage />
//                         </ProtectedRoute>
//                     }
//                 />
                
//                 <Route
//                     path="/manage/users"
//                     element={
//                         <ProtectedRoute>
//                         <UsersPage />
//                         </ProtectedRoute>
//                     }
//                 />
                
//                 <Route
//                     path="/manage/docs"
//                     element={
//                         <ProtectedRoute>
//                         <DocumentationPage />
//                         </ProtectedRoute>
//                     }
//                 />

//                 {/* 404 route */}
//                 <Route 
//                     path="*" 
//                     element={<Navigate to="/" replace />} 
//                 />
//             </Routes>
//         </Router>
//     );
// };

// export default App;
