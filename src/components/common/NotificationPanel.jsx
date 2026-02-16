import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotifications } from "../../context/NotificationContext";

const NotificationPanel = () => {
  const { notifications, removeNotification, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [filter, setFilter] = useState('All');

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Alerts') return ['warning', 'SYSTEM_ALERT', 'error'].includes(n.type);
    if (filter === 'Updates') return ['POLICY_UPDATE', 'ANNOUNCEMENT', 'MONTHLY_TARGET', 'success', 'INCENTIVE', 'info'].includes(n.type);
    return true;
  });

  // Get button position for portal positioning
  useEffect(() => {
    const updatePosition = () => {
      const button = document.querySelector('[data-notification-button]');
      if (button) {
        const rect = button.getBoundingClientRect();
        setButtonPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
      case "INCENTIVE":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "ANNOUNCEMENT":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case "POLICY_UPDATE":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "MONTHLY_TARGET":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "warning":
      case "SYSTEM_ALERT":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case "success":
      case "INCENTIVE":
        return "bg-green-100 border-green-200 text-green-700";
      case "ANNOUNCEMENT":
        return "bg-purple-100 border-purple-200 text-purple-700";
      case "POLICY_UPDATE":
        return "bg-blue-100 border-blue-200 text-blue-700";
      case "MONTHLY_TARGET":
        return "bg-indigo-100 border-indigo-200 text-indigo-700";
      case "warning":
      case "SYSTEM_ALERT":
        return "bg-red-100 border-red-200 text-red-700";
      case "info":
      default:
        return "bg-gray-100 border-gray-200 text-gray-700";
    }
  };

  const notificationPanel = (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className="fixed w-96 glass-card z-[9999] max-h-[80vh] overflow-hidden flex flex-col"
            style={{
              top: `${buttonPosition.top}px`,
              right: `${buttonPosition.right}px`
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary-600 text-white text-[10px] uppercase font-bold rounded-md tracking-wider">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      Mark Read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="flex px-4 space-x-4 pb-2">
                {['All', 'Alerts', 'Updates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`text-[10px] uppercase tracking-widest font-bold pb-1 border-b-2 transition-colors ${filter === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-48">
                  <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-full mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">All Caught Up</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {filter === 'All' ? 'No new notifications.' : `No ${filter} found.`}
                  </p>
                </div>
              ) : (
                <div className='divide-y divide-gray-100 dark:divide-slate-800'>
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-surface-2 transition-colors relative group ${!notification.isRead ? "bg-primary-50/30 dark:bg-primary-900/10" : ""
                        }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary-900 dark:text-primary-100' : "text-gray-900 dark:text-gray-100"}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                              {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                              className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                              title="Mark as read"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Dismiss"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="bg-gray-50 dark:bg-slate-900/80 p-2 text-center border-t border-gray-100 dark:border-slate-800">
                <button onClick={clearAll} className="text-[10px] text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Notification Bell */}
      <button
        data-notification-button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors z-50 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Render Portal */}
      {createPortal(notificationPanel, document.body)}
    </>
  );
};

export default NotificationPanel;
