const Card: React.FC<{ 
    title: string; 
    children: React.ReactNode 
}> = ({ title, children }) => {
    return (
        <div style={{ background: "white", padding: 20, borderRadius: 10 }}>
            <h3>{title}</h3>
            {children}
        </div>
    );
};

export default Card;
