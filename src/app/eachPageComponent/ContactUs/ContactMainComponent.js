"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  getContactList,
  markContactRead,
  deleteContact,
} from "@/app/Store/thunks";
import styled, { keyframes, css } from "styled-components";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Page layout ──────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  direction: rtl;
  background: #f5f5f5;
`;

// Dark gradient hero bar — same gradient as sidebar / Orders header
const HeroBar = styled.div`
  background-image: linear-gradient(195deg, #46506a 0%, #282e3f 100%);
  border-radius: 12px;
  margin: 12px 12px 0;
  padding: 18px 20px 22px;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50px;
    left: -50px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
  }
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/* Burger wrapper — only visible on mobile, white lines on dark header.
   NOTE: .navIcon3 is a CSS Module class so its hashed name can't be
   targeted from styled-components. The <span> elements inside it have
   NO class at all, so we target them directly with `span`. */
const BurgerWrap = styled.div`
  display: flex;
  align-items: center;

  /* Desktop (≥992px): sidebar is visible — hide the burger */
  @media (min-width: 992px) {
    display: none;
  }

  /* Strip Bootstrap Navbar.Toggle default styles */
  .navbar-toggler {
    padding: 0px 0px;
    margin: 0;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* The span elements inside the burger have no class, so this works.
     Force white to override the black set in NavBarToggleBurgerButton.module.scss */
  span {
    background-color: #fff !important;
  }

  /* Keep the green hover colour from the original SCSS animation */
  .navbar-toggler:hover span {
    background-color: #66bb6a !important;
  }
`;

const HeroTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: 150ms;
  font-weight: 500;

  &:hover { background: rgba(255, 255, 255, 0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 80px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px 14px;

  .stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: ${({ $accent }) => $accent || "#fff"};
    line-height: 1.2;
    margin-top: 2px;
  }
`;

// ─── Toolbar ─────────────────────────────────────────────────────────────────

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 4px;
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 16px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: 160ms;
  border: none;
  background: ${({ $active }) =>
    $active ? "linear-gradient(195deg, #46506a 0%, #282e3f 100%)" : "#f0f2f5"};
  /* !important to override the global .tabContent button { color: #fff } */
  color: ${({ $active }) => ($active ? "#fff" : "#3a3a3a")} !important;

  &:hover {
    background: ${({ $active }) =>
      $active ? "linear-gradient(195deg, #46506a 0%, #282e3f 100%)" : "#e4e7ed"};
    color: ${({ $active }) => ($active ? "#fff" : "#111")} !important;
  }
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  /* when on active (dark) button: semi-transparent white; when inactive (light) button: solid color */
  background: ${({ $orange, $onActive }) =>
    $orange ? "#ff6f00" : $onActive ? "rgba(255,255,255,0.25)" : "#282e3f"};
  color: #fff !important;
`;

// ─── Two-pane layout ─────────────────────────────────────────────────────────

const TwoPaneWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 12px 12px;
  flex: 1;
  min-height: 400px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ListPane = styled.div`
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: #d0d0d0 transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 4px; }

  @media (max-width: 768px) {
    width: 100%;
    max-height: 300px;
  }
`;

const DetailPane = styled.div`
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 24px rgba(40, 46, 63, 0.07);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: ${({ $empty }) => ($empty ? "center" : "stretch")};
  justify-content: ${({ $empty }) => ($empty ? "center" : "flex-start")};
`;

// ─── Message row ─────────────────────────────────────────────────────────────

const MsgRow = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid
    ${({ $active, $unread }) =>
      $active ? "#282e3f" : $unread ? "#90caf9" : "rgba(0,0,0,0.07)"};
  padding: 10px 12px;
  cursor: pointer;
  transition: box-shadow 140ms, border-color 140ms, background 140ms;
  position: relative;
  overflow: hidden;
  animation: ${fadeSlideIn} 220ms ease both;

  ${({ $unread }) =>
    $unread &&
    css`
      background: #f0f7ff;
      &::before {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #1565c0, #42a5f5);
        border-radius: 0 10px 10px 0;
      }
    `}

  ${({ $active }) =>
    $active &&
    css`
      background: #e8ecf5;
      box-shadow: 0 2px 10px rgba(40, 46, 63, 0.15);
    `}

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
    border-color: ${({ $active }) => ($active ? "#282e3f" : "#90caf9")};
  }
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $unread }) =>
    $unread
      ? "linear-gradient(135deg, #1565c0, #42a5f5)"
      : "linear-gradient(135deg, #78909c, #90a4ae)"};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
`;

const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #1565c0;
`;

const RowDate = styled.span`
  font-size: 10px;
  color: #9e9e9e;
  white-space: nowrap;
`;

const RowPreview = styled.div`
  font-size: 11.5px;
  color: #888;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 44px;
`;

// ─── Detail view ─────────────────────────────────────────────────────────────

const DetailHeader = styled.div`
  padding: 18px 22px 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, #f8f9fe 0%, #f1f3fa 100%);
`;

const DetailName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
`;

const ReadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  background: ${({ $read }) =>
    $read
      ? "linear-gradient(135deg, #43a047, #2e7d32)"
      : "linear-gradient(135deg, #fb8c00, #e65100)"};
  color: #fff;
  box-shadow: ${({ $read }) =>
    $read
      ? "0 2px 8px rgba(67, 160, 71, 0.4)"
      : "0 2px 8px rgba(251, 140, 0, 0.4)"};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const MetaChip = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: #555;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 8px;
  padding: 4px 10px;
  direction: ltr;
`;

const DetailBody = styled.div`
  flex: 1;
  padding: 22px;
  overflow-y: auto;
  animation: ${popIn} 180ms ease;
  background: #fff;
`;

const MessageLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9e9e9e;
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  background: linear-gradient(135deg, #f8f9fe 0%, #f1f3fa 100%);
  border: 1px solid #dde1f0;
  border-right: 4px solid #3949ab;
  border-radius: 0 12px 12px 12px;
  padding: 18px 20px;
  font-size: 14.5px;
  color: #2c2c2c;
  line-height: 2;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 2px 12px rgba(57, 73, 171, 0.06);
`;

const DetailActions = styled.div`
  padding: 16px 20px;
  border-top: 2px solid rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  background: #f7f8fc;
`;

const ActBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  font-size: 13.5px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 170ms ease;
  border: none;
  letter-spacing: 0.01em;

  /* primary = solid indigo/navy */
  ${({ $variant }) =>
    $variant === "primary" &&
    `
    background: linear-gradient(135deg, #3949ab, #283593);
    color: #fff;
    box-shadow: 0 3px 10px rgba(57, 73, 171, 0.35);
  `}

  /* danger = solid red */
  ${({ $variant }) =>
    $variant === "danger" &&
    `
    background: linear-gradient(135deg, #e53935, #b71c1c);
    color: #fff;
    box-shadow: 0 3px 10px rgba(229, 57, 53, 0.35);
  `}

  /* default fallback */
  ${({ $variant }) =>
    !$variant &&
    `
    background: #fff;
    color: #444;
    border: 1.5px solid #d0d0d0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $variant }) =>
      $variant === "primary"
        ? "0 6px 18px rgba(57, 73, 171, 0.45)"
        : $variant === "danger"
        ? "0 6px 18px rgba(229, 57, 53, 0.45)"
        : "0 4px 10px rgba(0,0,0,0.12)"};
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.95);
  }
`;

// ─── Placeholder / empty states ───────────────────────────────────────────────

const EmptyDetailPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #c8c8c8;
  text-align: center;
  padding: 40px;

  p { font-size: 13px; margin: 0; }
`;

const EmptyListState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 16px;
  color: #c8c8c8;
  text-align: center;

  p { font-size: 13px; margin: 0; }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkRow = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  padding: 10px 12px;

  .sk {
    height: 11px;
    border-radius: 5px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.3s infinite;
    margin-bottom: 7px;
  }
`;

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.9 11.5 19.79 19.79 0 01.87 2.86 2 2 0 012.84 1h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8.64a16 16 0 006.29 6.29l.96-1a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function getInitial(name = "") {
  return name.trim().charAt(0) || "؟";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const [deleteCode, setDeleteCode] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dispatch(getContactList()).unwrap();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setErrorText("خطا در دریافت پیام‌ها");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await dispatch(markContactRead({ code: msg.code, isRead: true })).unwrap();
        const updated = { ...msg, isRead: true };
        setMessages((prev) =>
          prev.map((m) => (m.code === msg.code ? updated : m))
        );
        setSelected(updated);
      } catch {
        // silent
      }
    }
  };

  const handleToggleRead = async () => {
    if (!selected) return;
    const newIsRead = !selected.isRead;
    try {
      await dispatch(
        markContactRead({ code: selected.code, isRead: newIsRead })
      ).unwrap();
      const updated = { ...selected, isRead: newIsRead };
      setMessages((prev) =>
        prev.map((m) => (m.code === selected.code ? updated : m))
      );
      setSelected(updated);
    } catch {
      setErrorText("خطا در تغییر وضعیت پیام");
      setErrorOpen(true);
    }
  };

  const handleDeleteRequest = () => {
    if (!selected) return;
    setDeleteCode(selected.code);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setConfirmDeleteOpen(false);
    try {
      await dispatch(deleteContact(deleteCode)).unwrap();
      setMessages((prev) => prev.filter((m) => m.code !== deleteCode));
      setSelected(null);
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2500);
    } catch {
      setErrorText("خطا در حذف پیام");
      setErrorOpen(true);
    } finally {
      setDeleteCode(null);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const readCount = messages.filter((m) => m.isRead).length;

  return (
    <PageWrapper>
      {/* ── Hero bar ── */}
      <HeroBar>
        <HeroTop>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <BurgerWrap>
              <NavBarToggleBurgerButton func={() => toggleShow("main")} />
            </BurgerWrap>
            <HeroTitle>
              <IconMail />
              پیام‌های تماس با ما
            </HeroTitle>
          </div>
          <RefreshBtn onClick={fetchMessages} disabled={loading}>
            <IconRefresh />
            {loading ? "بارگذاری..." : "بروزرسانی"}
          </RefreshBtn>
        </HeroTop>

        <StatsGrid>
          <StatCard>
            <div className="stat-label">کل پیام‌ها</div>
            <div className="stat-value">{messages.length}</div>
          </StatCard>
          <StatCard $accent="#ffd740">
            <div className="stat-label">خوانده‌نشده</div>
            <div className="stat-value">{unreadCount}</div>
          </StatCard>
          <StatCard $accent="#69f0ae">
            <div className="stat-label">خوانده‌شده</div>
            <div className="stat-value">{readCount}</div>
          </StatCard>
        </StatsGrid>
      </HeroBar>

      {/* ── Filter toolbar ── */}
      <Toolbar>
        <FilterGroup>
          <FilterBtn $active={filter === "all"} onClick={() => setFilter("all")}>
            همه
            {messages.length > 0 && (
              <CountBadge $onActive={filter === "all"}>{messages.length}</CountBadge>
            )}
          </FilterBtn>
          <FilterBtn
            $active={filter === "unread"}
            onClick={() => setFilter("unread")}
          >
            خوانده‌نشده
            {unreadCount > 0 && (
              <CountBadge $orange $onActive={filter === "unread"}>{unreadCount}</CountBadge>
            )}
          </FilterBtn>
          <FilterBtn
            $active={filter === "read"}
            onClick={() => setFilter("read")}
          >
            خوانده‌شده
          </FilterBtn>
        </FilterGroup>
      </Toolbar>

      {/* ── Two-pane ── */}
      <TwoPaneWrapper>
        {/* Left — message list */}
        <ListPane>
          {loading &&
            [1, 2, 3, 4].map((i) => (
              <SkRow key={i}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="sk"
                    style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, marginBottom: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="sk" style={{ width: "55%" }} />
                    <div className="sk" style={{ width: "35%" }} />
                  </div>
                  <div className="sk" style={{ width: 36, marginBottom: 0 }} />
                </div>
                <div className="sk" style={{ width: "75%" }} />
              </SkRow>
            ))}

          {!loading && filtered.length === 0 && (
            <EmptyListState>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>
                {filter === "all"
                  ? "هیچ پیامی دریافت نشده است."
                  : "پیامی در این دسته‌بندی وجود ندارد."}
              </p>
            </EmptyListState>
          )}

          {!loading &&
            filtered.map((msg) => (
              <MsgRow
                key={msg.code}
                $unread={!msg.isRead}
                $active={selected?.code === msg.code}
                onClick={() => handleSelect(msg)}
              >
                <RowTop>
                  <div className="d-flex align-items-center gap-2" style={{ overflow: "hidden", flex: 1 }}>
                    <AvatarCircle $unread={!msg.isRead}>
                      {getInitial(msg.name)}
                    </AvatarCircle>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: !msg.isRead ? 700 : 500,
                          color: "#1a1a2e",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#888", direction: "ltr" }}>
                        {msg.phone}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-1" style={{ flexShrink: 0 }}>
                    {!msg.isRead && <UnreadDot />}
                    <RowDate>{formatDate(msg.date)}</RowDate>
                  </div>
                </RowTop>
                <RowPreview>{msg.message}</RowPreview>
              </MsgRow>
            ))}
        </ListPane>

        {/* Right — detail view */}
        <DetailPane $empty={!selected}>
          {!selected ? (
            <EmptyDetailPlaceholder>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#d8d8d8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#d8d8d8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>یک پیام را از لیست انتخاب کنید</p>
            </EmptyDetailPlaceholder>
          ) : (
            <>
              <DetailHeader>
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <DetailName>{selected.name}</DetailName>
                  <ReadBadge $read={selected.isRead}>
                    {selected.isRead ? "✓ خوانده‌شده" : "● خوانده‌نشده"}
                  </ReadBadge>
                </div>
                <MetaRow>
                  <MetaChip>
                    <IconPhone />
                    {selected.phone}
                  </MetaChip>
                  <MetaChip>
                    <IconCalendar />
                    {formatDate(selected.date)}
                  </MetaChip>
                </MetaRow>
              </DetailHeader>

              <DetailBody>
                <MessageLabel>متن پیام</MessageLabel>
                <MessageBubble>{selected.message}</MessageBubble>
              </DetailBody>

              <DetailActions>
                <ActBtn $variant="primary" onClick={handleToggleRead}>
                  {selected.isRead ? (
                    <><IconEyeOff /> علامت‌گذاری به‌عنوان خوانده‌نشده</>
                  ) : (
                    <><IconEye /> علامت‌گذاری به‌عنوان خوانده‌شده</>
                  )}
                </ActBtn>
                <ActBtn $variant="danger" onClick={handleDeleteRequest}>
                  <IconTrash />
                  حذف پیام
                </ActBtn>
              </DetailActions>
            </>
          )}
        </DetailPane>
      </TwoPaneWrapper>

      <AreYouShureModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        text="آیا از حذف این پیام مطمئن هستید؟"
        func={handleDeleteConfirm}
      />
      <ConfirmModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        text="پیام با موفقیت حذف شد"
      />
      <ErrorModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        text={errorText || "خطایی رخ داده است"}
      />
    </PageWrapper>
  );
}
