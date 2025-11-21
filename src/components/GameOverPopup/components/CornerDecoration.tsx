type CornerDecorationProps = {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string;
};

const CornerDecoration = ({ position, color }: CornerDecorationProps) => {
    const positions = {
        'top-left': '-top-0.5 -left-0.5 border-t border-l',
        'top-right': '-top-0.5 -right-0.5 border-t border-r',
        'bottom-left': '-bottom-0.5 -left-0.5 border-b border-l',
        'bottom-right': '-bottom-0.5 -right-0.5 border-b border-r',
    };

    return <div className={`absolute w-2 h-2 ${positions[position]} ${color}`} />;
};

export default CornerDecoration;
