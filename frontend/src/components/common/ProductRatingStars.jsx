import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const ProductRatingStars = ({ productId }) => {
    const [rating, setRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/reviews/${productId}`);
                setRating(data.averageRating || 0);
                setReviewCount(data.count || 0);
            } catch (error) {
                console.error("Error fetching rating:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchRating();
        }
    }, [productId]);

    if (loading) return <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />;

    return (
        <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        fill={i < Math.round(rating) ? "currentColor" : "none"}
                        className={i < Math.round(rating) ? "text-yellow-500" : "text-slate-600"}
                    />
                ))}
            </div>
            <span className="text-xs text-slate-500 ml-1">
                ({reviewCount} reviews)
            </span>
        </div>
    );
};

export default ProductRatingStars;
