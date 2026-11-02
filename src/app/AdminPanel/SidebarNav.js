import styled from "styled-components";
import { Box } from "@mui/material";
import ShowVersionServer from "../Components/ShowVersionServer.js";

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 20px 16px;
    color: var(--c-ink);
    font-size: 16px;
    font-weight: 700;
  }

  .scroll {
    flex: 1;
    min-height: 0;
    padding: 4px 12px 12px;
    overflow-y: auto;
  }

  .group + .group {
    margin-top: 18px;
  }

  .groupTitle {
    padding: 0 12px 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--c-muted);
    letter-spacing: 0.2px;
  }

  .item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 42px;
    padding: 0 12px;
    margin-bottom: 2px;
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
    text-align: start;
    background: transparent;
    border: none;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    svg {
      font-size: 21px;
      color: #9ca3af;
      transition: color 0.15s ease;
    }

    &:hover {
      color: var(--c-ink);
      background-color: #f3f4f8;
    }

    &:focus-visible {
      outline: 3px solid var(--c-primary-100);
    }

    &.active {
      color: var(--c-primary);
      font-weight: 600;
      background-color: var(--c-primary-50);

      svg {
        color: var(--c-primary);
      }
      &::before {
        content: "";
        position: absolute;
        inset-inline-start: -12px;
        top: 9px;
        bottom: 9px;
        width: 3px;
        background: var(--c-primary);
        border-radius: 0 3px 3px 0;
      }
    }
  }

  .label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .footer {
    padding: 12px 20px;
    text-align: center;
    border-top: 1px solid var(--c-border);
    color: var(--c-muted);
  }
`;

export default function SidebarNav({ groups, activeTab, onSelect }) {
  return (
    <Nav aria-label="منوی اصلی">
      <div className="brand">
        <Box
          component="img"
          sx={{ width: 40, height: 40, objectFit: "contain" }}
          alt="آذر هولوگرام"
          src="/LOGO/cropped-com.chakavak.adv_512x512.png"
        />
        <span>آذر هولوگرام</span>
      </div>

      <div className="scroll">
        {groups.map((group) => (
          <div className="group" key={group.title}>
            <div className="groupTitle">{group.title}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                data-plain
                className={`item ${activeTab === item.id ? "active" : ""}`}
                aria-current={activeTab === item.id ? "page" : undefined}
                onClick={() => onSelect(item.id)}
              >
                {item.icon}
                <span className="label">{item.title}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="footer">
        <ShowVersionServer />
      </div>
    </Nav>
  );
}
