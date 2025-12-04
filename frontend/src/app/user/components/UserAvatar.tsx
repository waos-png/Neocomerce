interface UserAvatarProps {
  photo?: string;
  username?: string;
}

export function UserAvatar({ photo, username }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-500 to-red-700 flex items-center justify-center shadow-xl overflow-hidden border-4 border-white">
        {photo ? (
          <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-white">
            {username?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{username}</div>
        <div className="text-xs text-gray-500">Miembro desde 2024</div>
      </div>
    </div>
  );
}