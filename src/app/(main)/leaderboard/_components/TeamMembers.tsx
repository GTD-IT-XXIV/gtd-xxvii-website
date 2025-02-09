export const TeamMembers = ({leader, members}: {leader: string; members: string[]}) => (
  <div className="flex flex-wrap gap-1">
    <span className="px-2 py-1 text-sm bg-blue-100 rounded">{leader}</span>
    {members.map((member, i) => (
      <span key={i} className="px-2 py-1 text-sm bg-blue-100 rounded">
        {member}
      </span>
    ))}
  </div>
);
