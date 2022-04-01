import * as React from 'react';
import {
    SkeletonProps,
    Stack,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    SimpleGrid,
    Box,
    Flex,
    Divider,
} from '@chakra-ui/react';

type Props = {
    isLoading: boolean;
} & SkeletonProps;

const PageSkeleton: React.FC<Props> = ({isLoading = false, ...rest}) => {
    return (
        <Flex direction="column" h="100%">
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
            <Stack direction="column" flex="1" h="100%" w="100%" p={4}>
                <Skeleton w="full" h="100%" borderRadius="md" isLoaded={!isLoading} />
            </Stack>
            <Divider />
            <Stack direction="row" p={4}>
                <Skeleton boxSize={10} minW={10} borderRadius="md" isLoaded={!isLoading} />
                <Skeleton w="full" h={10} borderRadius="md" isLoaded={!isLoading} />
                <Stack justifyContent="center" alignItems="flex-end">
                    <SkeletonText w={10} noOfLines={1} borderRadius="md" isLoaded={!isLoading} />
                    <Skeleton w={6} h={3} borderRadius="full" isLoaded={!isLoading} />
                </Stack>
            </Stack>
        </Flex>
    );
};

export default PageSkeleton;