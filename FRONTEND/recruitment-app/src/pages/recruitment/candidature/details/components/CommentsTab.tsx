import { useAddCandidatureComment, useDeleteCandidatureComment, useGetCandidatureComments, useUpdateCandidatureComment } from "@/api/recruitment/candidatures/service";
import Modal from "@/components/modal";
import {
  CommentActionButton,
  CommentActions,
  CommentButton,
  CommentContent,
  CommentInputGroup,
  CommentItem,
  CommentMeta,
  CommentSection,
  CommentsList,
  CommentText,
  CommentTextarea
} from "@/styles/comment-styles";

import { Avatar } from "@/styles/detailsmission-styles";
import { SectionTitle } from "@/styles/popup-styles";
import { getInitials } from "@/utils/initials";
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle, Edit2, Send, Trash2, X } from "lucide-react";
import React, { useState } from "react";

interface Props {
    candidatureId?: string;
}

const CommentsTab: React.FC<Props> = ({ candidatureId }) => {
    // STATES
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState("");

    // 🔥 PAGINATION
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.userId || "";

    // QUERY
    const { data, isLoading } = useGetCandidatureComments(
        candidatureId || "", page, pageSize
    );

    const comments = data?.list || [];
    const totalCount = data?.totalCount || 0;

    const totalPages = Math.ceil(totalCount / pageSize);

    // MUTATIONS
    const addMutation = useAddCandidatureComment();
    const updateMutation = useUpdateCandidatureComment();
    const deleteMutation = useDeleteCandidatureComment();

    const isGlobalLoading =
        addMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending;

  // ACTIONS

    const handleSaveComment = async () => {
        if (!comment.trim() || !candidatureId) return;

        await addMutation.mutateAsync({
        candidatureId,
        data: { comment: comment, commentatorId: userId }
        });

        setComment("");
        setPage(1); // 🔥 revenir à la première page
    };

    const handleEditComment = (commentId: string, content: string) => {
        setEditingCommentId(commentId);
        setEditCommentText(content);
    };

    const handleSaveEditComment = async (commentId: string) => {
        if (!editCommentText.trim() || !candidatureId) return;

        await updateMutation.mutateAsync({
        commentId,
        candidatureId,
        data: { comment: editCommentText, commentatorId: userId }
        });

        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleConfirmDeleteComment = async () => {
        if (!candidatureId || !commentToDelete) return;

        await deleteMutation.mutateAsync({
            commentId: commentToDelete,
            candidatureId
        });

        setIsModalOpen(false);
        setCommentToDelete(null);
    };

  const formatDate = (date: string) => {
    return new Date(date + "Z").toLocaleString();
  };


  return (<>
    {/* MODAL */}
    {isModalOpen && (
      <Modal
        type="success"
        title="Confirmer"
        message="Voulez-vous supprimer ce commentaire ?"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmAction={handleConfirmDeleteComment}
        confirmLabel="Oui"
        cancelLabel="Non"
        showActions
      />
    )}

    <SectionTitle>Commentaires</SectionTitle>

    {/* INPUT */}
    <CommentSection>
        <CommentInputGroup>
            <CommentTextarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire..."
            />
        </CommentInputGroup>

        <CommentActions>
            <CommentButton
            onClick={handleSaveComment}
            disabled={!comment.trim() || isGlobalLoading}
            >
                <Send size={14} /> Envoyer
            </CommentButton>
        </CommentActions>
    </CommentSection>

    {/* LIST */}
    <CommentsList>
    {isLoading ? (
        <CommentText>Chargement...</CommentText>
    ) : comments.length === 0 ? (
        <CommentText>Aucun commentaire.</CommentText>
    ) : (
        comments.map((commentItem) => (
        <CommentItem key={commentItem.id}>
            <Avatar size="32px">{getInitials(commentItem.user.name)}</Avatar>

            <CommentContent>
            {editingCommentId === commentItem.id ? ( <>
                <CommentTextarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                />

                <CommentActions>
                    <CommentButton
                    onClick={() => handleSaveEditComment(commentItem.id)}
                    disabled={!editCommentText.trim() || isGlobalLoading}
                    >
                        <CheckCircle size={14} /> Sauvegarder
                    </CommentButton>

                    <CommentButton style={{backgroundColor:"var(--danger-color)",
                    borderColor:"var(--danger-color)"}}
                    onClick={() => setEditingCommentId(null)}>
                        <X size={14} /> Annuler
                    </CommentButton>
                </CommentActions>
                
            </> ) : ( <>
                <CommentText>{commentItem.comment}</CommentText>

                <CommentMeta>
                    Par {commentItem.user.name} le{" "}
                    {commentItem.updatedAt
                    ? formatDate(commentItem.updatedAt)
                    : formatDate(commentItem.createdAt)}
                </CommentMeta>
                
            </> )}
            </CommentContent>

            {commentItem.userId === userId && (
                <CommentActions>
                    <CommentActionButton
                    onClick={() =>
                        handleEditComment(commentItem.id, commentItem.comment)
                    }
                    disabled={isGlobalLoading}
                    >
                        <Edit2 size={16} />
                    </CommentActionButton>

                    <CommentActionButton
                    className="delete"
                    onClick={() => {
                        setCommentToDelete(commentItem.id);
                        setIsModalOpen(true);
                    }}
                    disabled={isGlobalLoading}
                    >
                        <Trash2 size={16} />
                    </CommentActionButton>
                </CommentActions>
            )}
        </CommentItem>
        ))
    )}
    </CommentsList>

    {/* PAGINATION UI */}
    {totalPages >= 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
          
            <CommentButton
             onClick={() => setPage((p) => p - 1)} disabled={page === 1}
            >
                <ArrowLeftCircle size={16} /> Précédent
            </CommentButton>

            <span>Page {page} / {totalPages}</span>

            <CommentButton
             onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
            >
                Suivant <ArrowRightCircle size={16} />
            </CommentButton>

        </div>
    )}
    </>
  );
};

export default CommentsTab;
