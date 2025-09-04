import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaTimes,
  FaBell,
  FaStar,
  FaFire,
  FaUsers,
  FaCoins,
  FaGift,
  FaTrophy,
  FaCheckCircle,
  FaAdn,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useAuth } from "./Services/AuthContext";
import {
  subscribeToNotifications,
  dismissNotification,
  markNotificationAsRead,
} from "./Services/notificationService";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #2d1b69 0%, #4a1e72 50%, #663399 100%);
  border-radius: 16px;
  border: 1px solid rgba(147, 51, 234, 0.3);
  min-height: 400px;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.2);

  @media (max-width: 768px) {
    padding: 16px;
    margin: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(147, 51, 234, 0.3);
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span`
  background: linear-gradient(135deg, #9333ea, #a855f7);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.4;
`;

const EmptyText = styled.h3`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(45, 27, 105, 0.8) 0%,
    rgba(74, 30, 114, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid
    ${(props) =>
      props.isRead ? "rgba(147, 51, 234, 0.25)" : "rgba(147, 51, 234, 0.5)"};
  position: relative;
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  opacity: ${(props) => (props.isRead ? 0.7 : 1)};

  &.removing {
    animation: ${fadeOut} 0.3s ease-out forwards;
  }

  &:hover {
    transform: translateX(4px);
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.2);
    background: linear-gradient(
      135deg,
      rgba(45, 27, 105, 0.9) 0%,
      rgba(74, 30, 114, 0.9) 100%
    );
    opacity: 1;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrapper = styled.div`
  background: linear-gradient(
    135deg,
    rgba(147, 51, 234, 0.3),
    rgba(168, 85, 247, 0.3)
  );
  border-radius: 8px;
  padding: 8px;
  color: ${(props) => props.color || "#a855f7"};
  font-size: 1.1rem;
  flex-shrink: 0;
  border: 1px solid rgba(147, 51, 234, 0.2);
`;

const TextContent = styled.div`
  flex: 1;
`;

const Message = styled.div`
  color: #ffffff;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 8px;
  font-weight: 500;
`;

const TimeStamp = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  font-weight: 400;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: absolute;
  top: 16px;
  right: 16px;

  &:hover {
    color: #a855f7;
    background: rgba(147, 51, 234, 0.2);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  background: ${(props) =>
    props.primary
      ? "linear-gradient(135deg, #9333ea, #a855f7)"
      : "rgba(147, 51, 234, 0.2)"};
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;
const getNotificationIcon = (type) => {
  switch (type) {
    case "mining_completed":
      return <FaCoins />;
    case "badge_earned":
      return <FaTrophy />;
    case "task_completed": // ✅ New
      return <FaCheckCircle />;
    case "quest_progress": // ✅ New
      return <FaAdn />;
    case "referral_success":
      return <FaUsers />;
    case "streak_milestone":
      return <FaFire />;
    case "welcome_bonus":
      return <FaGift />;
    case "level_up":
      return <FaStar />;
    default:
      return <FaBell />;
  }
};
const getNotificationColor = (type) => {
  switch (type) {
    case "mining_completed":
      return "#fbbf24";
    case "badge_earned":
      return "#8b5cf6";
    case "task_completed": // ✅ New
      return "#10b981";
    case "quest_progress": // ✅ New
      return "#06b6d4";
    case "referral_success":
      return "#10b981";
    case "streak_milestone":
      return "#f97316";
    case "welcome_bonus":
      return "#06b6d4";
    case "level_up":
      return "#f59e0b";
    default:
      return "#a855f7";
  }
};

export default function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let unsubscribe;

    const loadNotifications = async () => {
      try {
        setLoading(true);

        unsubscribe = subscribeToNotifications(
          currentUser.uid,
          (updatedNotifications) => {
            console.log("Notifications received:", updatedNotifications); // DEBUG
            setNotifications(updatedNotifications);
            setLoading(false); // This should execute when callback is called
          }
        );

        // ADD: Set a timeout to stop loading even if no notifications
        setTimeout(() => {
          setLoading(false);
        }, 5000); // 5 second timeout
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications");
        setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);
  const handleDismiss = async (notificationId) => {
    const card = document.querySelector(`[data-id="${notificationId}"]`);
    if (card) {
      card.classList.add("removing");

      try {
        await dismissNotification(currentUser.uid, notificationId);

        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notification) => notification.id !== notificationId)
          );
        }, 300);
      } catch (err) {
        console.error("Error dismissing notification:", err);
        card.classList.remove("removing");
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(currentUser.uid, notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead && !n.isDismissed
  ).length;

  if (!currentUser) {
    return (
      <Container>
        <Header>
          <Title>
            <FaBell />
            Notifications
          </Title>
        </Header>
        <EmptyState>
          <EmptyText>Please log in to view notifications</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>
            <FaBell />
            Notifications
          </Title>
        </Header>
        <LoadingState>
          <div style={{ textAlign: "center" }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p>Loading notifications...</p>
          </div>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>
            <FaBell />
            Notifications
          </Title>
        </Header>
        <EmptyState>
          <EmptyText>Error loading notifications</EmptyText>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.9rem",
              marginTop: "8px",
            }}
          >
            {error}
          </p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FaBell />
          Notifications
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </Title>
      </Header>

      {notifications.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎉</EmptyIcon>
          <EmptyText>All caught up!</EmptyText>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.9rem",
              marginTop: "8px",
            }}
          >
            No new notifications right now
          </p>
        </EmptyState>
      ) : (
        <NotificationsList>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              data-id={notification.id}
              isRead={notification.isRead}
            >
              <NotificationContent>
                <IconWrapper color={getNotificationColor(notification.type)}>
                  {getNotificationIcon(notification.type)}
                </IconWrapper>
                <TextContent>
                  <Message>{notification.message}</Message>
                  <TimeStamp>
                    {dayjs(
                      notification.timestamp?.toDate
                        ? notification.timestamp.toDate()
                        : notification.timestamp
                    ).format("MMM D, hh:mm A")}
                  </TimeStamp>

                  {!notification.isRead && (
                    <ActionButtons>
                      <ActionButton
                        primary
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as Read
                      </ActionButton>
                    </ActionButtons>
                  )}
                </TextContent>
              </NotificationContent>
              <DismissButton onClick={() => handleDismiss(notification.id)}>
                <FaTimes />
              </DismissButton>
            </NotificationCard>
          ))}
        </NotificationsList>
      )}
    </Container>
  );
}
