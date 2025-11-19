import { useEffect, useState } from "react";
import { getUser } from "../services/auth/auth.service";
import formatDate from "../shared/utils/date/date";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const data = await getUser();
                
                setUser(data);
            } catch (err) {
                setError("Failed to load user profile.");
            } finally {
                setLoading(false);
            }
        };
        loadUserProfile();
    }, []);

    const renderContent = () => {
        if (activeTab === "profile") {
            return (
                <div>
                    <h2>Profile Information</h2>
                    <p><strong>Ho va ten:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>So dien thoai:</strong> {user.phoneNumber}</p>
                    <p><strong>Ngay ra nhap:</strong> {formatDate(user.createdAt)}</p>
                </div>
            );
        } else if (activeTab === "settings") {
            return (
                <div>
                    <h2>Booking history</h2>
                    
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Payment history</h2>
                </div>
            );
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Profile Page</h1>
            <nav>
                <button onClick={() => setActiveTab("profile")}>Profile</button>
                <button onClick={() => setActiveTab("settings")}>Settings</button>
                <button onClick={() => setActiveTab("other")}>Other</button>
            </nav>
            {renderContent()}
        </div>
    );
}