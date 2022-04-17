import * as React from 'react';
import {FC} from 'react';
import {SkeletonProps, SkeletonCircle, SimpleGrid, Box} from '@chakra-ui/react';

type Props = {} & SkeletonProps;

const GradientStylesSkeleton: FC<Props> = ({isLoaded = false, ...rest}) => {
    return (
        <Box w="100%" h="48px" p={3} overflow="hidden" {...rest}>
            <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={2}>
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
                <SkeletonCircle boxSize={6} isLoaded={isLoaded} />
            </SimpleGrid>
        </Box>
    );
};

export default GradientStylesSkeleton;
