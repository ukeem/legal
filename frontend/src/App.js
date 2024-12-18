import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/indexPage/IndexPage';
import RegisterPage from './pages/registerPage/RegisterPage';
import ConfirmPage from './pages/confirmPage/ConfirmPage';
import ConfirmedPage from './pages/confirmedPage/ConfirmedPage';
import LoginPage from './pages/loginPage/LoginPage';
import ResetPasswordPage from './pages/resetPasswordPage/ResetPasswordPage';
import ResetPasswordSuccessPage from './pages/resetPasswordSuccessPage/ResetPasswordSuccessPage';
import NewPasswordPage from './pages/newPasswordPage/NewPasswordPage';
import NewPasswordSuccessPage from './pages/newPasswordSuccessPage/NewPasswordSuccessPage';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import RequestPage from './pages/requestPage/RequestPage';
import AdminPage from './pages/adminPage/AdminPage';
import './app.scss';
import Layout from './components/layout/Layout';
import LayoutUser from './components/layoutUser/LayoutUser';
import AdminPaymentPage from './pages/adminPaymentPage/AdminPaymentPage';
import { BalanceProvider } from './contexts/BalanceContext';
import UserPaymentPage from './pages/userPaymentPage/UserPaymentPage';
import UserHistoryPage from './pages/userHistoryPage/UserHistoryPage';
import UserResetPasswordPage from './pages/userResetPasswordPage/UserResetPasswordPage';
import AdminHistoryPage from './pages/adminHistoryPage/AdminHistoryPage';
import AdminRequestPage from './pages/adminRequestPage/AdminRequestPage';

function App() {
	return (
		<BalanceProvider>
			<Router>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/confirm" element={<ConfirmPage />} />
					<Route path="/confirmed" element={<ConfirmedPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/reset-password" element={<ResetPasswordPage />} />
					<Route path="/reset-password-success" element={<ResetPasswordSuccessPage />} />
					<Route path="/new-password" element={<NewPasswordPage />} />
					<Route path="/new-password-success" element={<NewPasswordSuccessPage />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute allowedRoles={['user']}>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route element={<LayoutUser />}>
						<Route
							path="/dashboard/request/:id" // Добавляем маршрут для RequestPage
							element={
								<ProtectedRoute allowedRoles={['user']}>
									<RequestPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard/payment" // Добавляем маршрут для RequestPage
							element={
								<ProtectedRoute allowedRoles={['user']}>
									<UserPaymentPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard/history" // Добавляем маршрут для RequestPage
							element={
								<ProtectedRoute allowedRoles={['user']}>
									<UserHistoryPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard/reset-password" // Добавляем маршрут для RequestPage
							element={
								<ProtectedRoute allowedRoles={['user']}>
									<UserResetPasswordPage />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route element={<Layout />}>
						<Route
							path="/admin/request/:id"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminRequestPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/payment"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminPaymentPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/history"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminHistoryPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/statistic"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminPaymentPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/add-admin"
							element={
								<ProtectedRoute allowedRoles={['admin']}>
									<AdminPaymentPage />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</Router>
		</BalanceProvider>
	);
}

export default App;
