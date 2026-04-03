import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Star, MessageSquarePlus } from "lucide-react";

const StarRow = ({ value, interactive = false, onSet }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => interactive && onSet?.(s)}
        className={`transition-all duration-150 ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
      >
        <Star
          size={interactive ? 28 : 16}
          className={s <= value ? "text-orange-400 fill-orange-400" : "text-slate-700 fill-slate-700"}
        />
      </button>
    ))}
  </div>
);

const TextRating = ({ productId }) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/reviews/${productId}`);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (productId) fetchReviews(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.warning("Please log in to submit a review"); return; }
    if (!rating || !feedback.trim()) { toast.error("Please provide a rating and feedback"); return; }
    try {
      setSubmitting(true);
      const { data } = await axiosInstance.post("/api/reviews", {
        productId, rating, feedback, userName: user?.name, email: user?.email,
      });
      toast.success(data.message || "Review submitted!");
      setRating(0); setFeedback("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // rating distribution
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length ? Math.round((reviews.filter((r) => r.rating === s).length / reviews.length) * 100) : 0,
  }));

  const initials = (name = "") => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const avatarColors = ["bg-orange-500", "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-pink-500"];
  const avatarColor = (name = "") => avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="space-y-10">

      {/* ── Summary + Write Review ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left: Score + Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-end gap-4">
            <span className="text-6xl font-black text-white leading-none">{averageRating}</span>
            <div className="mb-1">
              <StarRow value={Math.round(averageRating)} />
              <p className="text-slate-500 text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="space-y-2">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 w-4 text-right">{star}</span>
                <Star size={11} className="text-orange-400 fill-orange-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#ff6200] to-orange-400 rounded-full"
                  />
                </div>
                <span className="text-slate-500 w-5 text-left">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Write a Review */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquarePlus size={18} className="text-orange-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Write a Review</h4>
          </div>

          {!user ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3 text-center">
              <p className="text-slate-500 text-sm">Log in to share your experience</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                Login required
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star picker */}
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button"
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="transition-all duration-100 hover:scale-125">
                      <Star size={28}
                        className={s <= (hovered || rating)
                          ? "text-orange-400 fill-orange-400"
                          : "text-slate-700 fill-slate-700"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-[#ff6200] hover:bg-[#e55a00] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </motion.button>
            </form>
          )}
        </div>
      </div>

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <Star size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 ${avatarColor(review.userName)}`}>
                  {initials(review.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{review.userName}</p>
                  <p className="text-slate-600 text-xs">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className={s <= review.rating ? "text-orange-400 fill-orange-400" : "text-slate-700 fill-slate-700"} />
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <p className="text-slate-400 text-sm leading-relaxed">{review.feedback}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextRating;
