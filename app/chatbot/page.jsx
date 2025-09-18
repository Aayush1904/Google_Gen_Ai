const ChatbotPage = () => {
  return (
    <div className="flex justify-center items-center h-screen mt-5">
      <iframe 
        src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/01/29/11/20250129113329-VCD9NDX6.json" 
        className="w-full h-full border-none"
        style={{ width: '100%', height: '90vh', border: 'none' }}
        allow="microphone; camera"
      />
    </div>
  );
};

export default ChatbotPage;