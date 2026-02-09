import { useState, useEffect } from "react";
import { useAuth } from "../App";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Your plumbing service booking has been confirmed for Jan 15, 2026",
      time: "2 hours ago",
      read: false,
      icon: "✓",
      color: "text-success"
    },
    {
      id: 2,
      type: "review",
      title: "Leave a Review",
      message: "How was your electrical service experience? Rate your provider",
      time: "1 day ago",
      read: false,
      icon: "★",
      color: "text-warning"
    },
    {
      id: 3,
      type: "offer",
      title: "Special Offer",
      message: "Get 20% off on your next cleaning service booking",
      time: "2 days ago",
      read: true,
      icon: "%",
      color: "text-secondary"
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-secondary font-medium hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card p-16 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card p-5 flex items-start gap-4 cursor-pointer transition-all ${
                !notif.read ? 'bg-secondary/5 border-l-4 border-secondary' : ''
              }`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className={`w-12 h-12 rounded-full ${notif.read ? 'bg-gray-200' : 'bg-[#161E54]'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-2xl ${notif.read ? 'text-gray-600' : 'text-white'}`}>
                  {notif.icon}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${notif.read ? 'text-gray-700' : 'text-primary'}`}>
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="text-gray-400 hover:text-error transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
