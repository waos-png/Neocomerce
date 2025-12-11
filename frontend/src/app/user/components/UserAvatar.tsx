interface UserAvatarProps {
  photo?: string;
  username?: string;
}

export function UserAvatar({ photo, username }: UserAvatarProps) {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white flex-shrink-0">
        {photo ? (
          <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-red-600 bg-white">
            {username?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </div>
    </div>
  );
}