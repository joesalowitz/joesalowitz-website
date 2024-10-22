import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface MediaItem {
    type: string
    src: string
    alt?: string
    duration?: number
    dimensions?: string
}

interface MediaCarouselProps {
    items: MediaItem[]
    defaultInterval?: number
    className?: string
    defaultDimensions?: string
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
    items,
    defaultInterval = 4000,
    className,
    defaultDimensions = 'w-full h-full',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })
    const controls = useAnimation()

    useEffect(() => {
        if (inView && !isHovered) {
            const nextSlide = () => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
            }

            const currentItem = items[currentIndex]
            const interval = currentItem.duration || defaultInterval

            timerRef.current = setTimeout(nextSlide, interval)
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [inView, isHovered, defaultInterval, items, currentIndex])

    const renderMediaItem = (item: MediaItem) => {
        const dimensions = item.dimensions || defaultDimensions

        switch (item.type) {
            case 'image':
            case 'gif':
                return (
                    <img
                        src={item.src}
                        alt={item.alt || ''}
                        className={cn('object-contain', dimensions)}
                        draggable={false} // Prevent default drag behavior
                    />
                )
            case 'video':
                return (
                    <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={cn('object-contain', dimensions)}
                    />
                )
            default:
                return null
        }
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50 // minimum distance required to change slide
        if (info.offset.x > threshold) {
            // Dragged right, go to previous slide
            setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
        } else if (info.offset.x < -threshold) {
            // Dragged left, go to next slide
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
        } else {
            // If the drag wasn't far enough, animate back to the center
            controls.start({ x: 0 })
        }
    }

    return (
        <div
            ref={ref}
            className={cn(
                'relative',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                >
                    {renderMediaItem(items[currentIndex])}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default MediaCarousel
