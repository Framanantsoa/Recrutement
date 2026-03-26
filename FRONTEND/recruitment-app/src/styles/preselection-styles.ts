import styled from "styled-components";

export const PreselectionContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  padding: var(--spacing-2xl) var(--spacing-3xl);

  background: var(--bg-secondary);
`;

export const PreselectionHeader = styled.div`
  margin-bottom: var(--spacing-2xl);
`;

export const PreselectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color);
`;

export const PreselectionSubtitle = styled.div`
  margin-top: var(--spacing-sm);
  color: var(--text-muted);
`;

export const PreselectionTable = styled.div`
  width: 100%;
  background: var(--bg-primary);

  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);

  overflow: hidden;
`;

export const PreselectionTableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;

  padding: var(--spacing-lg) var(--spacing-xl);

  font-weight: var(--font-weight-semibold);

  background: var(--bg-tertiary);

  border-bottom: 1px solid var(--border-color);
`;

export const PreselectionRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;

  align-items: center;

  padding: var(--spacing-lg) var(--spacing-xl);

  border-bottom: 1px solid var(--border-color);

  transition: background var(--transition-speed);

  &:hover {
    background: var(--bg-light);
  }
`;

export const PreselectionCriterionName = styled.div`
  font-weight: var(--font-weight-medium);
`;

export const PreselectionCoefficient = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    width: 80px;
    height: 36px;

    padding: 0 var(--spacing-sm);

    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);

    text-align: center;

    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);

    outline: none;

    transition: border var(--transition-speed);

    &:focus {
      border-color: var(--primary-color);
    }

    /* supprimer les spin buttons chrome */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* supprimer les spin buttons firefox */
    -moz-appearance: textfield;
  }
`;

export const PreselectionScore = styled.div`
  text-align: center;
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
`;

export const PreselectionActions = styled.div`
  text-align: right;
`;

export const PreselectionEditButton = styled.button`
  background: var(--bg-light);
  border: none;

  padding: var(--spacing-xs) var(--spacing-sm);

  border-radius: var(--border-radius-sm);

  cursor: pointer;

  transition: background var(--transition-speed);

  &:hover {
    background: var(--bg-sidebar-hover);
  }
`;

export const PreselectionSaveButton = styled.button`
  background: var(--primary-color);
  color: var(--text-white);

  border: none;

  height: 36px;

  padding: 0 var(--spacing-lg);

  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);

  border-radius: var(--border-radius-sm);

  cursor: pointer;

  transition: background var(--transition-speed);

  &:hover {
    background: var(--primary-hover);
  }
`;

export const PreselectionTotalScore = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: var(--spacing-xl);

  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);

  background: var(--bg-tertiary);

  span {
    margin-left: var(--spacing-sm);
    color: var(--primary-color);
  }
`;

export const PreselectionFooter = styled.div`
  margin-top: var(--spacing-xl);
`;

export const PreselectionBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  background: var(--info-bg);

  border: none;

  padding: var(--spacing-sm) var(--spacing-lg);

  border-radius: var(--border-radius-sm);

  cursor: pointer;

  transition: background var(--transition-speed);

  &:hover {
    background: var(--grix);
    color: var(--text-white);
  }
`;