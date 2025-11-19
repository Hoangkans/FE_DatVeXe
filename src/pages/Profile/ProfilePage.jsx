import { useEffect, useState } from "react";
import MainLayout from "../../shared/layouts/MainLayout";

import { getUser } from "../../services/auth/auth.service";
import { ticketHistory } from "../../services/Ticket/TicketApi";
import UserProfile from "./UserProfile";
import BookingHistory from "./BookingHistory";
import PaymentHistory from "./PaymentHistory";

import "../../shared/styles/Profile.css"
export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const data = await getUser();
                setUser(data); 
            } catch (err) {
                console.error("Error loading user profile:", err);
            } finally {
                setLoading(false);
            }
        };
        loadUserProfile();
    }, []);


    useEffect(() => {
        if (activeTab === "ticket-history" && tickets.length === 0) {
            const loadTickets = async () => {
                setLoading(true);
                try {
                    const data = await ticketHistory();
                    setTickets(data);
                } catch (err) {
                    console.log("Failed to load ticket history.");
                } finally {
                    setLoading(false);
                }
            };
            loadTickets();
        }
    }, [activeTab, tickets.length]);

    const renderContent = () => {
        if (!user) return null; 

        switch (activeTab) {
            case "profile":
                return  <UserProfile user={user} />;
            case "ticket-history":
                return  <BookingHistory 
                            userId={user.id} 
                            tickets={tickets} 
                            loading={loading} 
                        />; 
            default: 
                return <PaymentHistory userId={user.id} />;
        }
    };

    if (loading) return <p>Loading user data...</p>;

    return (
        <MainLayout>
            <div className="profile-page-wrapper">
                <div className="profile-page-container">
                    <h1 className="profile-title">Profile <em>{user.fullName}</em></h1>
                    
                    <nav className="profile-nav">
                        <button 
                            onClick={() => setActiveTab("profile")}
                            className={`nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
                        >
                            Thông tin cá nhân
                        </button>

                        <button 
                            onClick={() => setActiveTab("ticket-history")}
                            className={`nav-tab-btn ${activeTab === "ticket-history" ? "active" : ""}`}
                        >
                            Lịch sử đặt vé
                        </button>

                        <button 
                            onClick={() => setActiveTab("payment-history")}
                            className={`nav-tab-btn ${activeTab === "payment-history" ? "active" : ""}`}
                        >
                            Lịch sử thanh toán
                        </button> 
                    </nav>

                    <div className="tab-content-area">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </MainLayout>
    ); 
}