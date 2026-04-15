"use client";

import React from "react";
import { Send, CheckCircle, UserPen, X } from "lucide-react";
import {
    CardsPaginationContainer,
    MissionCardsContainer as CardsContainer,
    Card,
    CardHeader,
    CardTitle,
    CardInfo,
    ActionsContainer,
    ActionButton,
    IndicatorBlock,
    IndicatorValue,
    IndicatorText,
} from "@/styles/card-styles";

import Pagination from "@/components/pagination";
import { Loading, NoDataMessage } from "@/styles/table-styles";
import RecruitmentStatusTag from "@/components/recruitment-status";
import { useUpdatePlaningDateTime, type PlaningDTO } from "@/api/recruitment/interview/service";

interface DraftPlaningCardsProps {
    planings: PlaningDTO[];
    isLoading: boolean;
    totalEntries: number;
    currentPage: number;
    pageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    formatDate: (date: string) => string;
    handleRowClick: (id: string) => void;
    setAlert: (alert: { type: "success" | "error"; message: string; isOpen: boolean }) => void;
}

const DraftPlaningCards: React.FC<DraftPlaningCardsProps> = ({
    planings,
    isLoading,
    totalEntries,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    formatDate,
    setAlert
}) => {
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [date, setDate] = React.useState<string>("");
    const [time, setTime] = React.useState<string>("");

    const { mutate, isPending } = useUpdatePlaningDateTime();

    const handleSubmit = (planingId: string) => {
        if (!date || !time) return;
        const dateTime = new Date(`${date}T${time}`);

        mutate({ planingId, dateTime }, {
            onSuccess: (response) => {
                setEditingId(null);
                setDate("");
                setTime("");

                setAlert({
                    type: "success",
                    message: response.message,
                    isOpen: true
                });
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message =
                    error?.response?.data?.message ||
                    "Une erreur est survenue";

                setAlert({
                    type: "error",
                    message,
                    isOpen: true
                });
            }
        });
        
    };

    const renderValidationIndicator = (level: number) => {
        return (
            <IndicatorBlock
                $daysUntilDue={999}
                style={{
                    border: "2px solid var(--primary-color)",
                    boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
                }}
            >
                <CheckCircle size={22} />
                <IndicatorValue style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {level}
                </IndicatorValue>
                <IndicatorText
                    style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        letterSpacing: "0.3px",
                    }}
                >
                    VALIDATION(S)
                </IndicatorText>
            </IndicatorBlock>
        );
    };

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
                    <Loading>Chargement des données...</Loading>
                ) : planings.length > 0 ? (<>
                    {planings.map((plan) => (
                        <Card key={plan.id} style={{ display: "flex", flexDirection: "column", height: "100%" }}>

                            {renderValidationIndicator(0)}

                            <CardHeader style={{ marginBottom: "0.5rem" }}>
                            {/* CANDIDAT */}
                                <CardTitle style={{ fontSize: "0.9rem" }}>
                                    {`${plan.candidature.name || "Candidat inconnu"} (${plan.candidatureId})`}
                                </CardTitle>

                            {/* STATUT */}
                                <RecruitmentStatusTag status={"en attente"} />
                            </CardHeader>

                            <CardInfo style={{ gap: "0.4rem", flex: 1 }}>
                            {/* ENVOYEUR */}
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0",
                                    flexWrap: "wrap",
                                }}>
                                    <UserPen size={15} style={{ color: "var(--primary-color)" }} />
                                    <div style={{ flex: 1, display: "flex", 
                                        alignItems: "center", fontSize: "11px",
                                    }}>
                                        {plan.validator.name || "Validateur inconnu"}
                                    </div>
                                </div>

                            {/* DATE D'ENVOI */}
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0",
                                    flexWrap: "wrap",
                                }}>
                                    <Send size={14} style={{ color: "var(--primary-color)" }} />
                                    <div style={{ flex: 1, display: "flex", 
                                        alignItems: "center", fontSize: "11px",
                                    }}>
                                        {formatDate(plan.createdAt)}
                                    </div>
                                </div>
                            </CardInfo>

                            {editingId === plan.id && (<>
                                <hr />
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                    marginBottom: "10px"
                                }}>
                                {/* DATE */}
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="form-input"
                                    />

                                {/* HEURE */}
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="form-input"
                                    />

                                {/* BOUTON VALIDER */}
                                    <ActionButton className="details"
                                        onClick={() => handleSubmit(plan.id)}
                                        disabled={isPending}
                                    >
                                        <CheckCircle size={14} /> Confirmer
                                    </ActionButton>
                                    <ActionButton className="details"
                                        style={{ backgroundColor: "#ef4444", color: "white" }}
                                        onClick={() => {
                                            setEditingId(null);
                                            setDate("");
                                            setTime("");
                                        }}
                                    >
                                        <X size={14} /> Annuler
                                    </ActionButton>
                                </div>
                            </>)}

                        {/* ACTIONS */}
                            <ActionsContainer style={{ marginTop: "auto" }}>
                                {editingId !== plan.id && (
                                    <ActionButton
                                        className="details"
                                        onClick={() => {
                                            setEditingId(plan.id);

                                            const now = new Date();
                                            setDate(now.toISOString().split("T")[0]);
                                            setTime(now.toTimeString().slice(0, 5));
                                        }}
                                    >
                                        <CheckCircle size={14} /> Planifier l'entretien
                                    </ActionButton>
                                )}
                            </ActionsContainer>
                        </Card>
                    ))}
                </>) : (
                    <NoDataMessage>Aucune demande de planification trouvée.</NoDataMessage>
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

export default DraftPlaningCards;
