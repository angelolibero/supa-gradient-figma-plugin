import * as React from 'react';
import {SkeletonProps, SkeletonCircle, SimpleGrid, Box, Flex, Divider} from '@chakra-ui/react';

type Props = {
    isLoading?: boolean;
} & SkeletonProps;

const StylesSkeleton: React.FC<Props> = ({isLoading = true, ...rest}) => {
    return (
        <Flex direction="column" h="72px">
            <Box w="100%" h="72px" p={4} overflow="hidden">
                <SimpleGrid columns={6} w="100%" height="auto" alignItems="center" spacing={3}>
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                    <SkeletonCircle boxSize={9} isLoaded={!isLoading} />
                </SimpleGrid>
            </Box>
            <Divider />
        </Flex>
    );
};

export default StylesSkeleton;
