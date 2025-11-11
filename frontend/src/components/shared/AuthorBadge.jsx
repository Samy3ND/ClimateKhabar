// src/components/AuthorBadge.jsx
export default function AuthorBadge({ user }) {
  if (!user) return null; // or show a skeleton if you prefer

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-slate-50">
      <img
        src={user.profilePicture}
        alt=""
        referrerPolicy="no-referrer"
        className="w-9 h-9 rounded-full object-cover"
      />
      <div className="leading-tight">
        <div className="text-sm text-slate-500">Author</div>
        <div className="text-sm font-medium text-slate-800">
          {user.username}
        </div>
      </div>
    </div>
  );
}
