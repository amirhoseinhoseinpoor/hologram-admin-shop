"use client";

import { Typography } from "@mui/material";
import styled from "styled-components";
import PropTypes from "prop-types";

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    props.$variant === "table" ? "40px 20px" : "60px 20px"};
  min-height: ${(props) => (props.$variant === "table" ? "300px" : "400px")};
  width: 100%;
  max-width: ${(props) => props.$maxWidth || "600px"};
  margin: 32px auto;
  grid-column: 1 / -1;

  background: var(--c-surface);
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--r-md);
  box-shadow: none;

  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 40px 15px;
    min-height: 300px;
    margin: 20px auto;
  }
`;

const IllustrationWrapper = styled.div`
  width: ${(props) => props.$width || "100%"};
  max-width: 400px;
  height: ${(props) => props.$height || "250px"};
  margin-bottom: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 768px) {
    height: ${(props) =>
      props.$height ? `calc(${props.$height} * 0.8)` : "200px"};
    margin-bottom: 20px;
  }
`;

const ContentWrapper = styled.div`
  text-align: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled(Typography)`
  font-family: unset !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  color: var(--c-ink) !important;
  margin-bottom: 12px !important;
  direction: rtl;

  @media (max-width: 768px) {
    font-size: 18px !important;
  }
`;

const Description = styled(Typography)`
  font-family: unset !important;
  font-size: 16px !important;
  color: var(--c-muted) !important;
  line-height: 1.6 !important;
  max-width: 450px;
  margin: 0 auto;
  direction: rtl;

  @media (max-width: 768px) {
    font-size: 14px !important;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;

  background-color: var(--c-primary);
  color: white;
  border: none;
  border-radius: var(--r-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    background-color: var(--c-primary-600);
  }

  &:active {
    transform: translateY(0px);
  }

  @media (max-width: 768px) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

const EmptyState = ({
  illustrationUrl,
  title,
  description,
  actionButtonText,
  onActionClick,
  actionButtonIcon,
  illustrationHeight = "250px",
  illustrationWidth = "100%",
  maxWidth = "600px",
  variant = "grid",
  className,
  containerStyle,
}) => {
  return (
    <EmptyStateContainer
      $variant={variant}
      $maxWidth={maxWidth}
      className={className}
      style={containerStyle}
    >
      <IllustrationWrapper
        $height={illustrationHeight}
        $width={illustrationWidth}
      >
        {/* static SVG illustrations from /public – next/image adds nothing here */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={illustrationUrl} alt={title} />
      </IllustrationWrapper>

      <ContentWrapper>
        <Title variant="h5">{title}</Title>
        {description && (
          <Description variant="body1">{description}</Description>
        )}
      </ContentWrapper>

      {actionButtonText && onActionClick && (
        <ActionButton onClick={onActionClick}>
          {actionButtonIcon}
          {actionButtonText}
        </ActionButton>
      )}
    </EmptyStateContainer>
  );
};

EmptyState.propTypes = {
  illustrationUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionButtonText: PropTypes.string,
  onActionClick: PropTypes.func,
  actionButtonIcon: PropTypes.node,
  illustrationHeight: PropTypes.string,
  illustrationWidth: PropTypes.string,
  maxWidth: PropTypes.string,
  variant: PropTypes.oneOf(["grid", "table"]),
  className: PropTypes.string,
  containerStyle: PropTypes.object,
};

export default EmptyState;
