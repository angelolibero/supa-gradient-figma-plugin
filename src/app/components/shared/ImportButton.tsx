import * as React from 'react';
import {FC} from 'react';
import {IconButton, Tooltip, ButtonProps} from '@chakra-ui/react';
import {CgImport} from 'react-icons/cg';

type Props = {
    onImport?: () => void;
} & ButtonProps;

const ImportButton: FC<Props> = ({onImport, ...rest}) => {
    return (
        <>
            <Tooltip label="Import gradient" openDelay={300}>
                <IconButton
                    icon={<CgImport />}
                    aria-label="import gradient"
                    onClick={onImport}
                    size="sm"
                    fontSize="lg"
                    {...rest}
                />
            </Tooltip>
        </>
    );
};

export default ImportButton;
