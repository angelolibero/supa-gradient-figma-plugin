const isGradientCompatible = (node: SceneNode): boolean => {
    return (
        node.type == 'RECTANGLE' ||
        node.type == 'ELLIPSE' ||
        node.type == 'POLYGON' ||
        node.type == 'VECTOR' ||
        node.type == 'FRAME'
    );
};

export {isGradientCompatible};
