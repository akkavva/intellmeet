interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Props {
  host: Participant;
  participants: any[];
  onlineSocketIds?: string[];
}

const ParticipantList = ({ host, participants, onlineSocketIds = [] }: Props) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        Participants
        <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">
          {participants.length + 1}
        </span>
      </h3>

      <div className="space-y-2">

        {/* Host */}
        <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {host.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-700"></span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{host.name}</p>
            <p className="text-xs text-gray-400">{host.email}</p>
          </div>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">
            Host
          </span>
        </div>

        {/* Other Participants */}
        {participants.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-2">
            No other participants yet
          </p>
        ) : (
          participants.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-700 rounded-lg p-2"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-sm font-bold">
                  {p.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-700"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {p.user?.name || `Participant ${i + 1}`}
                </p>
                <p className="text-xs text-gray-400">
                  {p.user?.email || 'member'}
                </p>
              </div>
              <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">
                Member
              </span>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ParticipantList;