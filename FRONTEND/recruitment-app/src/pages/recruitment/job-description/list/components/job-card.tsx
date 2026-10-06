"use client";

import React from "react";
import {
    Eye,
    Calendar,
    FileText,
    Send,
    UserCog,
} from "lucide-react";

import {
    CardsPaginationContainer,
    MissionCardsContainer as CardsContainer,
    Card,
    CardHeader,
    CardTitle,
    CardInfo,
    ActionsContainer,
    ActionButton,
} from "@/styles/card-styles";

import Pagination from "@/components/pagination";
import { Loading, NoDataMessage } from "@/styles/table-styles";
import RecruitmentStatusTag from "@/components/recruitment-status";
import type { JobDescriptionCardDTO } from "@/api/recruitment/job-description/service";

interface JobDescriptionCardProps {
    jobs: JobDescriptionCardDTO[];
    isLoading: boolean;
    totalEntries: number;
    currentPage: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    formatDate: (date: string) => string;
    handleRowClick: (id: string) => void;
}

const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({
    jobs,
    isLoading,
    totalEntries,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    formatDate,
    handleRowClick,
}) => {
    return (
        <CardsPaginationContainer style={{ maxWidth: "100%", overflowX: "hidden" }}>

            {/* LISTE DES CARTES */}
            <CardsContainer
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                }}
            >
                {isLoading ? (
                    <Loading>Chargement des demandes...</Loading>
                ) : jobs.length > 0 ? (
                    <>
                        {jobs.map((req) => (
                            <Card key={req.id} style={{ display: "flex", flexDirection: "column", height: "100%" }}>

                                {/* {renderValidationIndicator(req.validationLevel)} */}

                                <CardHeader style={{ marginBottom: "0.5rem" }}>
                                {/* POSTE */}
                                    <CardTitle style={{ fontSize: "0.9rem" }}>
                                        {req.post.toUpperCase()}
                                    </CardTitle>

                                {/* STATUT */}
                                    <RecruitmentStatusTag status={req.lastStatus} />
                                </CardHeader>

                                <CardInfo style={{ gap: "0.5rem", flex: 1 }}>
                                {/* SUP. HIERARCHIQUE */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <UserCog size={14} style={{ color: "var(--primary-color)" }} />
                                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                                        {req.hierarchicalManager || "N/A"}
                                        </span>
                                    </div>

                                {/* DIRECTION */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <FileText size={14} style={{ color: "var(--primary-color)" }} />
                                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                                        {req.direction || "N/A"}
                                        </span>
                                    </div>

                                {/* DEMANDEUR */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Send size={14} style={{ color: "var(--primary-color)" }} />
                                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                                        {req.applicantUser || "N/A"}
                                        </span>
                                    </div>

                                {/* DATE */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Calendar size={14} style={{ color: "var(--primary-color)" }} />
                                        <span style={{ fontSize: "11px" }}>
                                        {formatDate(req.createdAt)}
                                        </span>
                                    </div>

                                </CardInfo>

                                {/* ACTIONS */}
                                <ActionsContainer style={{ marginTop: "auto" }}>
                                    <ActionButton
                                        className="details"
                                        onClick={() => handleRowClick(req.id)}
                                    >
                                        <Eye size={14} />
                                        Voir les candidatures
                                    </ActionButton>
                                </ActionsContainer>
                            </Card>
                        ))}
                    </>
                ) : (
                    <NoDataMessage>Aucun poste trouvé.</NoDataMessage>
                )}
            </CardsContainer>

            {/* PAGINATION */}
            {totalEntries > 0 && (
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalEntries={totalEntries}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </CardsPaginationContainer>
    );
};

export default JobDescriptionCard;
