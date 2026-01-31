"use client";

import React from "react";
import { Typography } from "@mui/material";
import styled from "styled-components";
import PropTypes from "prop-types";

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$variant === 'table' ? '40px 20px' : '60px 20px'};
  min-height: ${props => props.$variant === 'table' ? '300px' : '400px'};
  width: 100%;
  max-width: ${props => props.$maxWidth || '600px'};
  margin: 40px auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);

  animation: fadeIn 0.6s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 40px 15px;
    min-height: 300px;
    margin: 20px auto;
  }
`;

const IllustrationWrapper = styled.div`
  width: ${props => props.$width || '100%'};
  max-width: 400px;
  height: ${props => props.$height || '250px'};
  margin-bottom: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @media (max-width: 768px) {
    height: ${props => props.$height ? `calc(${props.$height} * 0.8)` : '200px'};
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
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin-bottom: 12px !important;
  direction: rtl;

  @media (max-width: 768px) {
    font-size: 20px !important;
  }
`;

const Description = styled(Typography)`
  font-family: unset !important;
  font-size: 16px !important;
  color: #7f8c8d !important;
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
  padding: 12px 30px;

  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  box-shadow: 0px 4px 12px rgba(102, 187, 106, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 16px rgba(102, 187, 106, 0.5);
    background-image: linear-gradient(195deg, #43a047 0%, #66bb6a 100%);
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
      <IllustrationWrapper $height={illustrationHeight} $width={illustrationWidth}>
        <img src={illustrationUrl} alt={title} />
      </IllustrationWrapper>

      <ContentWrapper>
        <Title variant="h5">{title}</Title>
        {description && <Description variant="body1">{description}</Description>}
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
  variant: PropTypes.oneOf(['grid', 'table']),
  className: PropTypes.string,
  containerStyle: PropTypes.object,
};

export default EmptyState;
