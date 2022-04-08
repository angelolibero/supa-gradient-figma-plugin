import * as React from 'react';
import {SkeletonProps, SkeletonCircle, SimpleGrid, Box, Flex, Divider} from '@chakra-ui/react';

type Props = {} & SkeletonProps;

const GradientStylesSkeleton: React.FC<Props> = ({isLoaded = false, ...rest}) => {
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