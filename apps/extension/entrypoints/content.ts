/**
 * Content Script for Website-to-Cursor Extension
 * 
 * This script now supports multiple HTML extraction approaches:
 * 1. Clone approach: Safely clones elements before processing (default)
 * 2. Modify-restore approach: Temporarily modifies live DOM and restores it
 * 
 * To switch between approaches, modify the HTML_EXTRACTION_APPROACH constant in main().
 */
import { encodingForModel } from 'js-tiktoken';
import { apiClient } from '@/lib/api';
import { Sentry } from '@/lib/sentry';

// Declare global types
declare global {
  interface Window {
    __capturedStyles?: Record<string, {
      styles: Record<string, string>;
      element: Element;
    }>;
    __currentParentElements?: Element[];
  }
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Configuration: Choose HTML extraction approach
    // Options: 
    //   - 'clone': Clone elements before modifying (safe, no DOM changes, but more complex)
    //   - 'modify-restore': Modify original elements temporarily and restore (faster, preserves IDs, briefly modifies live DOM)
    // 
    // To switch approaches, change the value below:
    const HTML_EXTRACTION_APPROACH: 'clone' | 'modify-restore' = 'modify-restore';
    
    // Configuration: Enable/disable meaningful style override filtering
    // When enabled: Only styles that differ from default values are included (current behavior)
    // When disabled: All CSS properties with non-empty values are included (more comprehensive)
    const ENABLE_MEANINGFUL_STYLE_OVERRIDE = false;
    
    // Global error handler for content script
    window.addEventListener('error', (event) => {
      console.error('Global error in content script:', event.error);
      // Only capture non-null errors
      if (event.error !== null && event.error !== undefined) {
        Sentry.captureException(event.error);
      }
    });

    // Global unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection in content script:', event.reason);
      // Only capture non-null reasons
      if (event.reason !== null && event.reason !== undefined) {
        Sentry.captureException(event.reason);
      }
    });
    let isSelecting = false;
    let selectedElement: Element | null = null;
  
    let highlightElement: HTMLDivElement | null = null;
    let isTouchActive = false;

    // Listen for messages from popup
    browser.runtime.onMessage.addListener(async (message) => {
      if (message.action === 'startCapture') {
        if (message.type === 'component') {
          startElementSelection();
        } else if (message.type === 'fullpage') {
          await captureFullPage();
        }
      }
    });

    function startElementSelection() {
      isSelecting = true;
      document.body.style.cursor = 'crosshair';
      
      // Create highlight element with modern theme
      highlightElement = document.createElement('div');
      highlightElement.style.cssText = `
        position: fixed;
        border: 2px solid #10b981;
        background: rgba(16, 185, 129, 0.1);
        pointer-events: none;
        z-index: 999999;
        transition: all 0.1s ease;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
      `;
      document.body.appendChild(highlightElement);

      // Add event listeners for both mouse and touch events
      // Use capture phase to intercept events before they reach the target
      document.addEventListener('mouseover', handleMouseOver, true);
      document.addEventListener('mouseout', handleMouseOut, true);
      document.addEventListener('click', handleClick, true);
      document.addEventListener('keydown', handleKeyDown, true);
      
      // Add a global click handler with highest priority to block navigation
      document.addEventListener('click', handleGlobalClick, true);
      
      // Add touch event listeners for mobile view
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Add a visual indicator for mobile users only
      if (isMobileDevice()) {
        showMobileInstructions();
      }
    }

    function handleMouseOver(event: MouseEvent) {
      if (!isSelecting || !highlightElement || isTouchActive) return;
      
      const target = event.target as Element;
      if (target === document.body || target === document.documentElement) return;

      const rect = target.getBoundingClientRect();
      highlightElement.style.left = rect.left + 'px';
      highlightElement.style.top = rect.top + 'px';
      highlightElement.style.width = rect.width + 'px';
      highlightElement.style.height = rect.height + 'px';
      
      // Show parent tag overlay
      showParentTagOverlay(target, rect);
    }

    function handleMouseOut(event: MouseEvent) {
      if (!isSelecting || isTouchActive) return;
      
      // Hide parent tag overlay when mouse leaves an element
      removeParentTagOverlay();
    }

    function showParentTagOverlay(element: Element, rect: DOMRect) {
      // Remove existing parent tag overlay
      removeParentTagOverlay();
      
      // Get up to 4 parent elements
      const parentElements = getParentElements(element, 4);
      
      if (parentElements.length === 0) return;
      
      // Store parent elements globally for keyboard access
      window.__currentParentElements = parentElements;
      
      // Create parent tag overlay container
      const overlayContainer = document.createElement('div');
      overlayContainer.id = 'parent-tag-overlay';
      
      // Calculate optimal position for overlay
      const overlayWidth = 400; // Increased width to accommodate relationship labels
      const overlayHeight = 140 + (parentElements.length * 35);
      const padding = 20;
      
      // Check if overlay would cover the highlighted element
      const wouldCoverElement = overlayWidth > rect.width || overlayHeight > rect.height;
      
      let left, top;
      
      if (wouldCoverElement) {
        // If overlay would cover the element, position it below the element
        left = rect.left + (rect.width / 2) - (overlayWidth / 2);
        top = rect.bottom + 15; // 15px below the element
        
        // Ensure overlay stays within viewport bounds
        if (left < 15) left = 15;
        if (left + overlayWidth > window.innerWidth - 15) {
          left = window.innerWidth - overlayWidth - 15;
        }
        if (top + overlayHeight > window.innerHeight - 15) {
          // If it would go below viewport, try positioning above the element
          // But ensure it doesn't overlap with the element
          const abovePosition = rect.top - overlayHeight - 15;
          if (abovePosition >= 15 && abovePosition + overlayHeight <= rect.top) {
            // Above position is valid and doesn't overlap
            top = abovePosition;
          } else {
            // Above position would overlap or go off-screen, try alternative positions
            
            // Option 1: Try to the right of the element
            const rightPosition = rect.right + 15;
            if (rightPosition + overlayWidth <= window.innerWidth - 15) {
              left = rightPosition;
              top = rect.top; // Align with top of element
            } else {
              // Option 2: Try to the left of the element
              const leftPosition = rect.left - overlayWidth - 15;
              if (leftPosition >= 15) {
                left = leftPosition;
                top = rect.top; // Align with top of element
              } else {
                // Option 3: Last resort - position at top of viewport but ensure no overlap
                top = 15;
                // Adjust left to avoid covering the element
                if (rect.left + rect.width < overlayWidth + 30) {
                  // Element is too narrow, center overlay in viewport
                  left = (window.innerWidth - overlayWidth) / 2;
                } else {
                  // Try to position overlay to the right of element
                  left = Math.min(rect.right + 15, window.innerWidth - overlayWidth - 15);
                }
              }
            }
          }
        }
      } else {
        // If overlay is smaller than element, position it inside the element, centered
        left = rect.left + (rect.width / 2) - (overlayWidth / 2);
        top = rect.top + (rect.height / 2) - (overlayHeight / 2);
        
        // Ensure overlay stays within viewport bounds
        if (left < 15) left = 15;
        if (left + overlayWidth > window.innerWidth - 15) {
          left = window.innerWidth - overlayWidth - 15;
        }
        if (top < 15) top = 15;
        if (top + overlayHeight > window.innerHeight - 15) {
          top = window.innerHeight - overlayHeight - 15;
        }
      }
      
      overlayContainer.style.cssText = `
        position: fixed;
        top: ${top}px;
        left: ${left}px;
        width: ${overlayWidth}px;
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #52525b;
        border-radius: 12px;
        padding: ${padding}px;
        z-index: 1000000;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #e4e4e7;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
      `;
      
      // Create overlay content
      const instructions = document.createElement('div');
      instructions.style.cssText = `
        margin-bottom: 15px;
        font-size: 12px;
        text-align: center;
        border-bottom: 1px solid rgba(82, 82, 91, 0.3);
        padding-bottom: 10px;
        color: #10b981;
        font-weight: 500;
      `;
      
      instructions.innerHTML = `
        <strong>📋 CAPTURE OPTIONS</strong><br>
        <span style="font-size: 11px; opacity: 0.8; color: #a1a1aa;">Press number key or click element</span>
      `;
      
      const parentList = document.createElement('div');
      parentList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      `;
      
      // Create parent element indicators with hierarchy
      parentElements.forEach((parentElement, index) => {
        const parentIndicator = createParentIndicator(parentElement, index, parentElements.length);
        parentList.appendChild(parentIndicator);
      });
      
      overlayContainer.appendChild(instructions);
      overlayContainer.appendChild(parentList);
      document.body.appendChild(overlayContainer);
    }

    function getParentElements(element: Element, maxCount: number): Element[] {
      const parents: Element[] = [];
      
      // Start with the current element (index 0)
      if (isElementCapturable(element)) {
        parents.push(element);
      }
      
      // Then add parent elements
      let current = element.parentElement;
      let count = 1; // Start from 1 since we already added the current element
      
      while (current && count < maxCount) {
        // Always include html/body even if not capturable, otherwise apply capturable filter
        if (
          current === document.body ||
          current === document.documentElement ||
          isElementCapturable(current)
        ) {
          parents.push(current);
          count++;
        }
        current = current.parentElement;
      }
      
      return parents;
    }

    function isElementCapturable(element: Element): boolean {
      const rect = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      
      // Check if element is visible and has reasonable dimensions
      return (
        rect.width > 10 &&
        rect.height > 10 &&
        styles.display !== 'none' &&
        styles.visibility !== 'hidden' &&
        styles.opacity !== '0' &&
        // Skip elements that are part of our extension UI
        !element.closest('#parent-tag-overlay') &&
        !element.closest('#capture-success-notification') &&
        !element.closest('#capture-error-notification') &&
        !element.closest('#mobile-instructions') &&
        !element.closest('#capture-bottom-loader')
      );
    }



    function createParentIndicator(parentElement: Element, index: number, totalElements: number): HTMLDivElement {
      const indicator = document.createElement('div');
      const tagName = parentElement.tagName.toLowerCase();
      const className = parentElement.className ? String(parentElement.className).split(' ')[0] : '';
      const id = parentElement.id;
      
      // Create hierarchy visualization
      const hierarchyLevel = totalElements - index - 1;
      const hierarchyIndent = '  '.repeat(hierarchyLevel);
      
      // Create indicator text with hierarchy and truncate if too long
      let indicatorText = `${index + 1}. ${hierarchyIndent}${tagName}`;
      if (className) {
        indicatorText += `.${className}`;
      }
      if (id) {
        indicatorText += `#${id}`;
      }
      
      // Truncate text if it's too long (max 35 characters)
      const maxLength = 35;
      if (indicatorText.length > maxLength) {
        indicatorText = indicatorText.substring(0, maxLength - 3) + '...';
      }
      
      indicator.textContent = indicatorText;
      indicator.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        padding: 8px 10px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 8px;
        color: #10b981;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 20px;
        width: 100%;
      `;
      
      // Add a small visual indicator for the number
      const numberBadge = document.createElement('span');
      numberBadge.textContent = `${index + 1}`;
      numberBadge.style.cssText = `
        background: #10b981;
        color: #ffffff;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        flex-shrink: 0;
      `;
      
      // Create a container for the element info (number + tag info)
      const elementInfo = document.createElement('div');
      elementInfo.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0; // Allow flex item to shrink
      `;
      
      elementInfo.appendChild(numberBadge);
      
      // Create the tag text element
      const tagText = document.createElement('span');
      tagText.textContent = indicatorText;
      tagText.style.cssText = `
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `;
      
      elementInfo.appendChild(tagText);
      
      // Add hierarchy indicator (shows the relationship) - positioned outside the box
      const hierarchyIndicator = document.createElement('span');
      hierarchyIndicator.style.cssText = `
        color: #059669;
        font-size: 12px;
        font-weight: 500;
        margin-left: 15px;
        white-space: nowrap;
        flex-shrink: 0;
      `;
      
      if (index === 0) {
        hierarchyIndicator.textContent = '← Current element';
      } else if (index === 1) {
        hierarchyIndicator.textContent = '← Parent';
      } else if (index === 2) {
        hierarchyIndicator.textContent = '← Grandparent';
      } else {
        hierarchyIndicator.textContent = '← Ancestor';
      }
      
      // Clear the indicator and rebuild with proper structure
      indicator.innerHTML = '';
      indicator.appendChild(elementInfo);
      indicator.appendChild(hierarchyIndicator);
      
      return indicator;
    }

    function highlightParentElement(element: Element) {
      if (!highlightElement) return;
      
      const rect = element.getBoundingClientRect();
      
      // Temporarily change highlight to show it's capturing the parent
      const originalBorder = highlightElement.style.border;
      const originalBackground = highlightElement.style.background;
      const originalBoxShadow = highlightElement.style.boxShadow;
      
      highlightElement.style.border = '3px solid #f59e0b';
      highlightElement.style.background = 'rgba(245, 158, 11, 0.2)';
      highlightElement.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
      
      highlightElement.style.left = rect.left + 'px';
      highlightElement.style.top = rect.top + 'px';
      highlightElement.style.width = rect.width + 'px';
      highlightElement.style.height = rect.height + 'px';
      
      // Restore original highlight after a brief moment
      setTimeout(() => {
        if (highlightElement) {
          highlightElement.style.border = originalBorder;
          highlightElement.style.background = originalBackground;
          highlightElement.style.boxShadow = originalBoxShadow;
        }
      }, 300);
    }

    function removeParentTagOverlay() {
      const existingOverlay = document.getElementById('parent-tag-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Clear current parent elements
      if (window.__currentParentElements) {
        delete window.__currentParentElements;
      }
    }

    function handleGlobalClick(event: MouseEvent) {
      if (!isSelecting) return;
      
      // Block any navigation attempts immediately
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button'))) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    }

    function handleClick(event: MouseEvent) {
      if (!isSelecting || isTouchActive) return;
      
      // Immediately stop all event propagation
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Get the element under the cursor
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element || element === document.body || element === document.documentElement) {
        return false;
      }
      
      selectedElement = element;
      stopElementSelection();
      captureComponent(selectedElement);
      
      // Return false to ensure the event is completely blocked
      return false;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isSelecting) {
        stopElementSelection();
        return;
      }
      
      // Handle number keys for parent element capture
      if (isSelecting && window.__currentParentElements) {
        const keyNumber = parseInt(event.key);
        if (keyNumber >= 1 && keyNumber <= 4 && keyNumber <= window.__currentParentElements.length) {
          event.preventDefault();
          
          const targetElement = window.__currentParentElements[keyNumber - 1];
          if (targetElement) {
            // Highlight the target element briefly
            highlightParentElement(targetElement);
            
            // Capture the target element
            selectedElement = targetElement;
            stopElementSelection();
            captureComponent(selectedElement);
          }
        }
      }
    }

    // Touch event handlers for mobile view
    function handleTouchStart(event: TouchEvent) {
      if (!isSelecting) return;
      
      event.preventDefault();
      isTouchActive = true;
      
      // Show immediate visual feedback
      if (highlightElement) {
        highlightElement.style.border = '3px solid #10b981';
        highlightElement.style.background = 'rgba(16, 185, 129, 0.2)';
        highlightElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
      }
      
      updateTouchHighlight(event);
    }

    function handleTouchMove(event: TouchEvent) {
      if (!isSelecting) return;
      
      event.preventDefault();
      updateTouchHighlight(event);
    }

    function updateTouchHighlight(event: TouchEvent) {
      if (!highlightElement) return;
      
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (element && element !== document.body && element !== document.documentElement) {
        const rect = element.getBoundingClientRect();
        highlightElement.style.left = rect.left + 'px';
        highlightElement.style.top = rect.top + 'px';
        highlightElement.style.width = rect.width + 'px';
        highlightElement.style.height = rect.height + 'px';
        
        // Make the highlight more visible during touch
        highlightElement.style.border = '3px solid #10b981';
        highlightElement.style.background = 'rgba(16, 185, 129, 0.2)';
        highlightElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
        
        // Show parent tag overlay for touch as well
        showParentTagOverlay(element, rect);
      }
    }

    function showMobileInstructions() {
      // Create a mobile instruction overlay
      const mobileOverlay = document.createElement('div');
      mobileOverlay.id = 'mobile-instructions';
      mobileOverlay.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #52525b;
        color: #e4e4e7;
        padding: 15px 20px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        max-width: 300px;
        text-align: center;
      `;
      
      mobileOverlay.innerHTML = `
        <div style="margin-bottom: 10px;">📱 <strong>Mobile Mode Active</strong></div>
        <div style="font-size: 12px; opacity: 0.8;">
          Touch and drag to highlight elements<br>
          Release to capture the component
        </div>
        <button id="close-mobile-instructions" style="
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid #10b981;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          margin-top: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 500;
        ">Close</button>
      `;
      
      document.body.appendChild(mobileOverlay);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        const overlay = document.getElementById('mobile-instructions');
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.5s ease';
          setTimeout(() => overlay.remove(), 500);
        }
      }, 5000);
      
      // Manual close button
      mobileOverlay.querySelector('#close-mobile-instructions')?.addEventListener('click', () => {
        mobileOverlay.remove();
      });
    }

    function handleTouchEnd(event: TouchEvent) {
      if (!isSelecting) return;
      
      event.preventDefault();
      isTouchActive = false;
      const touch = event.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (element && element !== document.body && element !== document.documentElement) {
        selectedElement = element;
        stopElementSelection();
        captureComponent(selectedElement);
      }
    }

    function stopElementSelection() {
      isSelecting = false;
      isTouchActive = false;
      document.body.style.cursor = '';
      
      if (highlightElement) {
        highlightElement.remove();
        highlightElement = null;
      }
      
      // Remove parent tag overlay
      removeParentTagOverlay();
      

      
      // Remove mobile instructions
      const mobileInstructions = document.getElementById('mobile-instructions');
      if (mobileInstructions) {
        mobileInstructions.remove();
      }
      
      // Remove mouse event listeners
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('click', handleGlobalClick, true);
      
      // Remove touch event listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    async function captureComponent(element: Element) {
      showBottomLoader('Capturing component…');
      try {
        const screenshot = await captureElementScreenshot(element);
        const htmlData = extractElementHTML(element);
        
        // Upload to server
        const response = await apiClient.createCapture({
          website_url: window.location.href,
          token_count: htmlData.tokenCount,
          html: htmlData.outerHTML,
          png_screenshot: screenshot.split(',')[1] // Remove data:image/png;base64, prefix
        });
        
        // Show success notification
        showCaptureSuccess(response.slug, htmlData.tokenCount);
        
        // Send message to popup if it's open
        try {
          await browser.runtime.sendMessage({
            action: 'captureCompleted',
            captureId: response.slug,
            type: 'component'
          });
        } catch (error) {
          // Popup might be closed, ignore this error
          console.log('Popup not available for message');
        }
      } catch (error) {
        console.error('Error capturing component:', error);
        Sentry.captureException(error);
        showCaptureError(error);
      } finally {
        hideBottomLoader();
      }
    }

    async function captureFullPage() {
      showBottomLoader('Capturing page…');
      try {
        const screenshot = await captureFullPageScreenshot();
        const htmlData = extractPageHTML();
        
        // Upload to server
        const response = await apiClient.createCapture({
          website_url: window.location.href,
          token_count: htmlData.tokenCount,
          html: htmlData.outerHTML,
          png_screenshot: screenshot.split(',')[1] // Remove data:image/png;base64, prefix
        });
        
        // Show success notification
        showCaptureSuccess(response.slug, htmlData.tokenCount);
        
        // Send message to popup if it's open
        try {
          await browser.runtime.sendMessage({
            action: 'captureCompleted',
            captureId: response.slug,
            type: 'fullpage'
          });
        } catch (error) {
          // Popup might be closed, ignore this error
          console.log('Popup not available for message');
        }
      } catch (error) {
        console.error('Error capturing full page:', error);
        Sentry.captureException(error);
        showCaptureError(error);
      } finally {
        hideBottomLoader();
      }
    }

    async function captureElementScreenshot(element: Element): Promise<string> {
      const rect = element.getBoundingClientRect();
      
      try {
        // Temporarily hide loader to avoid capturing it in screenshot
        const loader = document.getElementById('capture-bottom-loader');
        const prevDisplay = loader?.style.display;
        if (loader) loader.style.display = 'none';
        // Send message to background script to capture screenshot
        const response = await browser.runtime.sendMessage({
          action: 'captureScreenshot'
        });
        if (loader) loader.style.display = prevDisplay || '';
        
        if (!response) {
          throw new Error('No response received from background script');
        }
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.screenshot) {
          throw new Error('No screenshot data received');
        }
        
        // Crop the screenshot to the element bounds
        return await cropScreenshot(response.screenshot, rect);
      } catch (error) {
        console.error('Error in captureElementScreenshot:', error);
        Sentry.captureException(error);
        throw error;
      }
    }

    async function captureFullPageScreenshot(): Promise<string> {
      try {
        // Temporarily hide loader to avoid capturing it in screenshot
        const loader = document.getElementById('capture-bottom-loader');
        const prevDisplay = loader?.style.display;
        if (loader) loader.style.display = 'none';
        // Send message to background script to capture screenshot
        const response = await browser.runtime.sendMessage({
          action: 'captureScreenshot'
        });
        if (loader) loader.style.display = prevDisplay || '';
        
        if (!response) {
          throw new Error('No response received from background script');
        }
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (!response.screenshot) {
          throw new Error('No screenshot data received');
        }
        
        return response.screenshot;
      } catch (error) {
        console.error('Error in captureFullPageScreenshot:', error);
        Sentry.captureException(error);
        throw error;
      }
    }

    // Bottom-centered loader overlay shown during capture
    function showBottomLoader(text: string = 'Capturing…') {
      if (document.getElementById('capture-bottom-loader')) return;
      // Ensure keyframes exist once
      if (!document.getElementById('capture-bottom-loader-style')) {
        const style = document.createElement('style');
        style.id = 'capture-bottom-loader-style';
        style.textContent = `
          @keyframes capture-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
      }
      const container = document.createElement('div');
      container.id = 'capture-bottom-loader';
      container.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        z-index: 1000001;
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #52525b;
        color: #e4e4e7;
        padding: 8px 12px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        pointer-events: none;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
      `;
      const spinner = document.createElement('div');
      spinner.style.cssText = `
        width: 14px;
        height: 14px;
        border: 2px solid #10b981;
        border-top-color: transparent;
        border-radius: 50%;
        animation: capture-rotate 0.8s linear infinite;
      `;
      const label = document.createElement('span');
      label.textContent = text;
      container.appendChild(spinner);
      container.appendChild(label);
      document.body.appendChild(container);
    }

    function hideBottomLoader() {
      const container = document.getElementById('capture-bottom-loader');
      if (container) container.remove();
    }

    function extractElementHTML(element: Element) {
      switch (HTML_EXTRACTION_APPROACH) {
        case 'clone':
          return extractElementHTMLWithCloning(element);
        case 'modify-restore':
          return extractElementHTMLWithModifyRestore(element);
        default:
          console.warn(`Unknown HTML extraction approach: ${HTML_EXTRACTION_APPROACH}, falling back to cloning`);
          return extractElementHTMLWithCloning(element);
      }
    }

    function extractPageHTML() {
      switch (HTML_EXTRACTION_APPROACH) {
        case 'clone':
          return extractPageHTMLWithCloning();
        case 'modify-restore':
          return extractPageHTMLWithModifyRestore();
        default:
          console.warn(`Unknown HTML extraction approach: ${HTML_EXTRACTION_APPROACH}, falling back to cloning`);
          return extractPageHTMLWithCloning();
      }
    }

    // Helper function to get computed styles from original elements (no cloning needed)
    function getComputedStylesFromOriginal(element: Element) {
      const styles = window.getComputedStyle(element);
      const computedStyles: Record<string, string> = {};
      
      // Get all computed styles using a comprehensive list of CSS properties
      const cssProperties = [
        // Layout properties
        'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
        'float', 'clear', 'overflow', 'overflow-x', 'overflow-y',
        'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
        'box-sizing', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border', 'border-width', 'border-style', 'border-color',
        'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
        'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
        'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
        'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
        'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
        
        // Typography properties
        'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant', 'font-stretch',
        'line-height', 'text-align', 'text-decoration', 'text-transform', 'text-indent',
        'letter-spacing', 'word-spacing', 'white-space', 'vertical-align',
        'color', 'background-color', 'background-image', 'background-repeat', 'background-position', 'background-size',
        
        // Visual properties
        'opacity', 'visibility', 'cursor', 'outline', 'outline-width', 'outline-style', 'outline-color',
        'box-shadow', 'text-shadow', 'transform', 'transition', 'animation',
        
        // Flexbox properties
        'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
        'justify-content', 'align-items', 'align-content', 'align-self',
        
        // Grid properties
        'grid', 'grid-template', 'grid-template-areas', 'grid-template-rows', 'grid-template-columns',
        'grid-area', 'grid-row', 'grid-column', 'grid-gap', 'grid-row-gap', 'grid-column-gap',
        
        // Other properties
        'content', 'quotes', 'counter-reset', 'counter-increment', 'resize', 'user-select',
        'pointer-events', 'clip', 'clip-path', 'filter', 'backdrop-filter'
      ];
      
      // Get all computed styles
      for (let i = 0; i < cssProperties.length; i++) {
        const property = cssProperties[i];
        const value = styles.getPropertyValue(property);
        
        // Always include position and box-sizing properties regardless of their values
        if (property === 'position' || property === 'box-sizing') {
          computedStyles[property] = value;
          continue;
        }
        
        // Skip empty or invalid values
        if (!value || value === '' || value === 'initial' || value === 'normal' || value === 'none' || value === 'auto') {
          continue;
        }

        // Apply filtering logic for specific properties
        let shouldInclude = true;

        // 1. If paddings are 0px, exclude those
        if (property.startsWith('padding') && value === '0px') {
          shouldInclude = false;
        }

        // 2. If margins are 0px, exclude those
        if (property.startsWith('margin') && value === '0px') {
          shouldInclude = false;
        }

        // 3. If display is not flex, remove all flex properties
        const displayValue = styles.getPropertyValue('display');
        if (property.startsWith('flex') && displayValue !== 'flex') {
          shouldInclude = false;
        }

        // 4. If min-width, min-height is 0px, exclude those
        if ((property === 'min-width' || property === 'min-height') && value === '0px') {
          shouldInclude = false;
        }

        // 5. If border radii are 0px, exclude those
        if ((property === 'border-top-left-radius' || property === 'border-top-right-radius' || 
             property === 'border-bottom-right-radius' || property === 'border-bottom-left-radius') && value === '0px') {
          shouldInclude = false;
        }

        // 6. If borders are 0px, exclude all corresponding border properties
        if (property === 'border-left-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-right-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-top-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-bottom-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border') {
          const borderWidth = styles.getPropertyValue('border-width');
          if (borderWidth === '0px') {
            shouldInclude = false;
          }
        }
        
        // Check border properties against their corresponding width values
        if (property === 'border-left') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-left-color') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right-color') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top-color') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-color') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-left-style') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right-style') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top-style') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-style') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // 7. If display is not grid, exclude all grid related properties
        if (property.startsWith('grid') && displayValue !== 'grid') {
          shouldInclude = false;
        }

        // 8. Remove default browser values for common properties
        if (property === 'background-color' && value.trim() === 'rgba(0, 0, 0, 0)') {
          shouldInclude = false;
        }
        if (property === 'background-repeat' && value.trim() === 'repeat') {
          shouldInclude = false;
        }
        if (property === 'background-position' && value.trim() === '0% 0%') {
          shouldInclude = false;
        }
        if (property === 'overflow' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-x' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-y' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'opacity' && value.trim() === '1') {
          shouldInclude = false;
        }
        if (property === 'visibility' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'text-align' && value.trim() === 'start') {
          shouldInclude = false;
        }
        if (property === 'text-decoration' && value.trim() === 'none solid rgb(255, 255, 255)') {
          shouldInclude = false;
        }
        if (property === 'text-indent' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'word-spacing' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'vertical-align' && value.trim() === 'baseline') {
          shouldInclude = false;
        }

        if (!shouldInclude) {
          continue;
        }
        
        // Check if meaningful style override filtering is enabled
        if (ENABLE_MEANINGFUL_STYLE_OVERRIDE) {
          // Check if this is a meaningful override by comparing with default values
          if (isMeaningfulStyleOverride(property, value, element)) {
            computedStyles[property] = value;
          }
        } else {
          // When disabled, include all properties with non-empty values
          computedStyles[property] = value;
        }
      }
      
      return computedStyles;
    }

    // Helper function to get computed styles from cloned elements (needs to find original)
    function getComputedStyles(element: Element) {
      // We need to get the original element from the DOM to get computed styles
      // Since we're working with a cloned element, we need to find the original
      let originalElement = element;
      
      // If this is a cloned element, try to find the original in the DOM
      if (!document.contains(element)) {
        // Try to find the original element by matching attributes
        const selector = generateSelector(element);
        if (selector) {
          try {
            const foundElement = document.querySelector(selector);
            if (foundElement) {
              console.log("Found the original element", foundElement, originalElement)
              originalElement = foundElement;
            }
          } catch (error) {
            // If selector is invalid, log the error and continue with the original element
            console.warn('Invalid selector generated:', selector, error);
          }
        }
      }
      
      const styles = window.getComputedStyle(originalElement);
      const computedStyles: Record<string, string> = {};
      console.log(element.tagName, String(element.className || ''));
      console.log(JSON.parse(JSON.stringify(styles)));
      
      // Get all computed styles using a comprehensive list of CSS properties
      const cssProperties = [
        // Layout properties
        'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
        'float', 'clear', 'overflow', 'overflow-x', 'overflow-y',
        'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
        'box-sizing', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border', 'border-width', 'border-style', 'border-color',
        'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
        'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
        'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
        'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
        'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
        
        // Typography properties
        'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant', 'font-stretch',
        'line-height', 'text-align', 'text-decoration', 'text-transform', 'text-indent',
        'letter-spacing', 'word-spacing', 'white-space', 'vertical-align',
        'color', 'background-color', 'background-image', 'background-repeat', 'background-position', 'background-size',
        
        // Visual properties
        'opacity', 'visibility', 'cursor', 'outline', 'outline-width', 'outline-style', 'outline-color',
        'box-shadow', 'text-shadow', 'transform', 'transition', 'animation',
        
        // Flexbox properties
        'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
        'justify-content', 'align-items', 'align-content', 'align-self',
        
        // Grid properties
        'grid', 'grid-template', 'grid-template-areas', 'grid-template-rows', 'grid-template-columns',
        'grid-area', 'grid-row', 'grid-column', 'grid-gap', 'grid-row-gap', 'grid-column-gap',
        
        // Other properties
        'content', 'quotes', 'counter-reset', 'counter-increment', 'resize', 'user-select',
        'pointer-events', 'clip', 'clip-path', 'filter', 'backdrop-filter'
      ];
      
      // Get all computed styles
      for (let i = 0; i < cssProperties.length; i++) {
        const property = cssProperties[i];
        const value = styles.getPropertyValue(property);
        
        // Always include position and box-sizing properties regardless of their values
        if (property === 'position' || property === 'box-sizing') {
          computedStyles[property] = value;
          continue;
        }
        
        // Skip empty or invalid values
        if (!value || value === '' || value === 'initial' || value === 'normal' || value === 'none' || value === 'auto') {
          continue;
        }

        // Apply filtering logic for specific properties
        let shouldInclude = true;

        // 1. If paddings are 0px, exclude those
        if (property.startsWith('padding') && value === '0px') {
          shouldInclude = false;
        }

        // 2. If margins are 0px, exclude those
        if (property.startsWith('margin') && value === '0px') {
          shouldInclude = false;
        }

        // 3. If display is not flex, remove all flex properties
        const displayValue = styles.getPropertyValue('display');
        if (property.startsWith('flex') && displayValue !== 'flex') {
          shouldInclude = false;
        }

        // 4. If min-width, min-height is 0px, exclude those
        if ((property === 'min-width' || property === 'min-height') && value === '0px') {
          shouldInclude = false;
        }

        // 5. If border radii are 0px, exclude those
        if ((property === 'border-top-left-radius' || property === 'border-top-right-radius' || 
             property === 'border-bottom-right-radius' || property === 'border-bottom-left-radius') && value === '0px') {
          shouldInclude = false;
        }

        // 6. If borders are 0px, exclude all corresponding border properties
        console.log(`[DEBUG] Processing property: ${property} with value: "${value}"`);
        if (property === 'border-left-width' && value === '0px') {
          console.log(`[DEBUG] Excluding ${property} because value is 0px`);
          // Exclude border-left-width, border-left, border-left-color
          shouldInclude = false;
        }
        if (property === 'border-right-width' && value === '0px') {
          console.log(`[DEBUG] Excluding ${property} because value is 0px`);
          // Exclude border-right-width, border-right, border-right-color
          shouldInclude = false;
        }
        if (property === 'border-top-width' && value === '0px') {
          console.log(`[DEBUG] Excluding ${property} because value is 0px`);
          // Exclude border-top-width, border-top, border-top-color
          shouldInclude = false;
        }
        if (property === 'border-bottom-width' && value === '0px') {
          console.log(`[DEBUG] Excluding ${property} because value is 0px`);
          // Exclude border-bottom-width, border-bottom, border-bottom-color
          shouldInclude = false;
        }
        if (property === 'border-width' && value === '0px') {
          console.log(`[DEBUG] Excluding ${property} because value is 0px`);
          // Exclude border-width, border, border-color, border-style
          shouldInclude = false;
        }
        if (property === 'border') {
          const borderWidth = styles.getPropertyValue('border-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-width="${borderWidth}"`);
          if (borderWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-left') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-left-width="${leftWidth}"`);
          if (leftWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-left-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-right') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-right-width="${rightWidth}"`);
          if (rightWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-right-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-top') {
          const topWidth = styles.getPropertyValue('border-top-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-top-width="${topWidth}"`);
          if (topWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-top-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-bottom-width="${bottomWidth}"`);
          if (bottomWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-bottom-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-left-color') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-left-width="${leftWidth}"`);
          if (leftWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-left-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-left-style') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-left-width="${leftWidth}"`);
          if (leftWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-left-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-right-color') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-right-width="${rightWidth}"`);
          if (rightWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-right-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-right-style') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-right-width="${rightWidth}"`);
          if (rightWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-right-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-top-color') {
          const topWidth = styles.getPropertyValue('border-top-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-top-width="${topWidth}"`);
          if (topWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-top-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-top-style') {
          const topWidth = styles.getPropertyValue('border-top-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-top-width="${topWidth}"`);
          if (topWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-top-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-color') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-bottom-width="${bottomWidth}"`);
          if (bottomWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-bottom-width is 0px`);
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-style') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          console.log(`[DEBUG] ${property}: value="${value}", border-bottom-width="${bottomWidth}"`);
          if (bottomWidth === '0px') {
            console.log(`[DEBUG] Excluding ${property} because border-bottom-width is 0px`);
            shouldInclude = false;
          }
        }

        // 7. If display is not grid, exclude all grid related properties
        if (property.startsWith('grid') && displayValue !== 'grid') {
          shouldInclude = false;
        }

        // 8. Remove default browser values for common properties
        if (property === 'background-color' && value.trim() === 'rgba(0, 0, 0, 0)') {
          shouldInclude = false;
        }
        if (property === 'background-repeat' && value.trim() === 'repeat') {
          shouldInclude = false;
        }
        if (property === 'background-position' && value.trim() === '0% 0%') {
          shouldInclude = false;
        }
        if (property === 'overflow' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-x' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-y' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'opacity' && value.trim() === '1') {
          shouldInclude = false;
        }
        if (property === 'visibility' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'text-align' && value.trim() === 'start') {
          shouldInclude = false;
        }
        if (property === 'text-decoration' && value.trim() === 'none solid rgb(255, 255, 255)') {
          shouldInclude = false;
        }
        if (property === 'text-indent' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'word-spacing' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'vertical-align' && value.trim() === 'baseline') {
          shouldInclude = false;
        }

        if (!shouldInclude) {
          continue;
        }
        
        // Check if meaningful style override filtering is enabled
        if (ENABLE_MEANINGFUL_STYLE_OVERRIDE) {
          // Check if this is a meaningful override by comparing with default values
          if (isMeaningfulStyleOverride(property, value, originalElement)) {
            computedStyles[property] = value;
          }
        } else {
          // When disabled, include all properties with non-empty values
          computedStyles[property] = value;
        }
      }
      
      return computedStyles;
    }

    // Approach 1: Clone and modify (current approach)
    function extractElementHTMLWithCloning(element: Element) {
      // Clone the element to avoid modifying the original DOM
      const clonedElement = element.cloneNode(true) as Element;
      
      // Recursively apply computed styles as classes
      applyComputedStylesAsInline(clonedElement);
      
      const finalHTML = generateFinalHTML(clonedElement);
      const tokenCount = countTokens(finalHTML);
      
      return {
        outerHTML: finalHTML,
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        id: element.id,
        tokenCount: tokenCount
      };
    }

    function extractPageHTMLWithCloning() {
      // Clone the document element to avoid modifying the original DOM
      const clonedDocument = document.documentElement.cloneNode(true) as Element;
      
      // Recursively apply computed styles as classes
      applyComputedStylesAsInline(clonedDocument);
      
      const finalHTML = generateFinalHTML(clonedDocument);
      const tokenCount = countTokens(finalHTML);
      
      return {
        outerHTML: finalHTML,
        tokenCount: tokenCount
      };
    }

    // Approach 2: Modify original element and restore (new approach)
    function extractElementHTMLWithModifyRestore(element: Element) {
      // Store original state (convert to string to handle DOMTokenList)
      const originalClasses = String(element.className || '');
      
      try {
        // Apply computed styles as classes (keep existing classes)
        applyComputedStylesAsInlineToOriginal(element);
        
        // Generate final HTML with style tag
        const finalHTML = generateFinalHTML(element);
        const tokenCount = countTokens(finalHTML);
        
        return {
          outerHTML: finalHTML,
          tagName: element.tagName.toLowerCase(),
          className: element.className, // Classes are preserved
          id: element.id,
          tokenCount: tokenCount
        };
      } finally {
        // Restore original classes
        element.className = originalClasses;
        // Clear captured styles
        if (window.__capturedStyles) {
          delete window.__capturedStyles;
        }
      }
    }

    function extractPageHTMLWithModifyRestore() {
      // Store original state of document element (convert to string to handle DOMTokenList)
      const originalClasses = String(document.documentElement.className || '');
      
      try {
        // Apply computed styles as classes (keep existing classes)
        applyComputedStylesAsInlineToOriginal(document.documentElement);
        
        // Generate final HTML with style tag
        const finalHTML = generateFinalHTML(document.documentElement);
        const tokenCount = countTokens(finalHTML);
        
        return {
          outerHTML: finalHTML,
          tokenCount: tokenCount
        };
      } finally {
        // Restore original classes
        document.documentElement.className = originalClasses;
        // Clear captured styles
        if (window.__capturedStyles) {
          delete window.__capturedStyles;
        }
      }
    }

    // Helper function for modify-restore approach (works with original elements)
    function applyComputedStylesAsInlineToOriginal(element: Element) {
      // Get computed styles directly from the original element
      const computedStyles = getComputedStylesFromOriginal(element);
      
      // Generate a unique ID for this element
      const uniqueId = generateUniqueId(element);
      
      // Add the unique ID to the element (with safety check)
      try {
        element.setAttribute('id', uniqueId);
      } catch (error) {
        console.warn('Could not set ID on element:', error);
        // Continue without setting ID - the element will still be processed
      }
      
      // Store the styles for later use in the style tag
      if (Object.keys(computedStyles).length > 0) {
        // Store styles in a global object to be used when generating the final HTML
        if (!window.__capturedStyles) {
          window.__capturedStyles = {};
        }
        window.__capturedStyles[uniqueId] = {
          styles: computedStyles,
          element: element
        };
      }
      
      // Recursively process all child elements
      const children = Array.from(element.children);
      children.forEach(child => {
        applyComputedStylesAsInlineToOriginal(child);
      });
    }

    // Helper function for cloning approach (works with cloned elements)
    function applyComputedStylesAsInline(element: Element) {
      // Get computed styles for this element
      const computedStyles = getComputedStyles(element);
      
      // Generate a unique ID for this element
      const uniqueId = generateUniqueId(element);
      
      // Add the unique ID to the element (with safety check)
      try {
        element.setAttribute('id', uniqueId);
      } catch (error) {
        console.warn('Could not set ID on element:', error);
        // Continue without setting ID - the element will still be processed
      }
      
      // Store the styles for later use in the style tag
      if (Object.keys(computedStyles).length > 0) {
        // Store styles in a global object to be used when generating the final HTML
        if (!window.__capturedStyles) {
          window.__capturedStyles = {};
        }
        window.__capturedStyles[uniqueId] = {
          styles: computedStyles,
          element: element
        };
      }
      
      // Recursively process all child elements
      const children = Array.from(element.children);
      children.forEach(child => {
        applyComputedStylesAsInline(child);
      });
    }

    // Generate a unique ID for an element
    function generateUniqueId(element: Element): string {
      try {
        // Create a hash from the element's tag name, classes, and position
        const tagName = element.tagName.toLowerCase();
        // Convert className to string (handles both string and DOMTokenList)
        const className = String(element.className || '');
        const id = String(element.id || '');
        
        // Get element's position in the DOM tree
        let path = '';
        let current: Element | null = element;
        let depth = 0;
        
        while (current && current !== document.body && depth < 10) {
          const siblings = Array.from(current.parentNode?.children || []);
          const index = siblings.indexOf(current);
          path = `${current.tagName.toLowerCase()}:${index}${path}`;
          current = current.parentNode as Element;
          depth++;
        }
        
        // Create a unique identifier with safe string operations
        const safeId = id ? String(id).replace(/[^a-zA-Z0-9]/g, '_') : '';
        const safeClassName = className ? String(className).replace(/[^a-zA-Z0-9]/g, '_') : '';
        const safePath = path ? String(path).replace(/[^a-zA-Z0-9:]/g, '_') : '';
        const uniqueId = `${tagName}_${safeId}_${safeClassName}_${safePath}`;
        
        // Generate a hash to make it shorter and more unique
        let hash = 0;
        try {
          for (let i = 0; i < uniqueId.length; i++) {
            const char = uniqueId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }
        } catch (error) {
          // Fallback hash generation if there's an issue
          hash = uniqueId.length + Date.now();
        }
        
        return `capture_${Math.abs(hash).toString(36)}`;
      } catch (error) {
        // Ultimate fallback if anything goes wrong
        console.warn('Error generating unique ID, using fallback:', error);
        return `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
    }



    // Generate CSS rules for all captured styles including pseudo-classes
    function generateStyleTag(): string {
      if (!window.__capturedStyles || Object.keys(window.__capturedStyles).length === 0) {
        return '';
      }
      
      const cssRules: string[] = [];
      
      Object.entries(window.__capturedStyles).forEach(([elementId, styleData]) => {
        // Generate the main ID rule
        const mainRule = `#${elementId} {\n  ${Object.entries(styleData.styles)
          .map(([property, value]) => `  ${property}: ${value};`)
          .join('\n  ')}\n}`;
        cssRules.push(mainRule);
        
        // Generate pseudo-class rules for this element
        const pseudoClassRules = generatePseudoClassRules(elementId, styleData.styles);
        cssRules.push(...pseudoClassRules);

        // Generate pseudo-element rules for this element
        // Use the stored element reference directly
        const pseudoElementRules = generatePseudoElementRules(elementId, styleData.element);
        cssRules.push(...pseudoElementRules);
      });
      
      return `<style>\n${cssRules.join('\n\n')}\n</style>`;
    }

    // Generate pseudo-class rules for an element
    function generatePseudoClassRules(elementId: string, styles: Record<string, string>): string[] {
      const pseudoClassRules: string[] = [];
      
      // Common pseudo-classes to check
      const pseudoClasses = ['hover', 'focus', 'active', 'visited', 'link'];
      
      pseudoClasses.forEach(pseudoClass => {
        const pseudoStyles: Record<string, string> = {};
        
        // Check if any styles would be overridden by this pseudo-class
        // This is a simplified approach - in a real implementation, you might want to
        // check the actual CSS rules or computed styles for pseudo-classes
        if (styles['color'] && pseudoClass === 'hover') {
          pseudoStyles['color'] = styles['color'];
        }
        if (styles['background-color'] && pseudoClass === 'hover') {
          pseudoStyles['background-color'] = styles['background-color'];
        }
        if (styles['border-color'] && pseudoClass === 'hover') {
          pseudoStyles['border-color'] = styles['border-color'];
        }
        if (styles['transform'] && pseudoClass === 'active') {
          pseudoStyles['transform'] = styles['transform'];
        }
        
        // Only add pseudo-class rules if there are meaningful styles
        if (Object.keys(pseudoStyles).length > 0) {
          const pseudoRule = `#${elementId}:${pseudoClass} {\n  ${Object.entries(pseudoStyles)
            .map(([property, value]) => `  ${property}: ${value};`)
            .join('\n  ')}\n}`;
          pseudoClassRules.push(pseudoRule);
        }
      });
      
      return pseudoClassRules;
    }

    // Generate pseudo-element rules for an element
    function generatePseudoElementRules(elementId: string, element: Element): string[] {
      const pseudoElementRules: string[] = [];
      
      // Common pseudo-elements to check
      const pseudoElements = ['before', 'after'];
      
      pseudoElements.forEach(pseudoElement => {
        try {
          // Get computed styles for the pseudo-element
          const pseudoStyles = getComputedStylesForPseudoElement(element, pseudoElement);
          
          if (Object.keys(pseudoStyles).length > 0) {
            const pseudoRule = `#${elementId}::${pseudoElement} {\n  ${Object.entries(pseudoStyles)
              .map(([property, value]) => `  ${property}: ${value};`)
              .join('\n  ')}\n}`;
            pseudoElementRules.push(pseudoRule);
          }
        } catch (error) {
          // Silently skip pseudo-elements that can't be accessed
          console.debug(`Could not access ::${pseudoElement} pseudo-element:`, error);
        }
      });
      
      return pseudoElementRules;
    }

    // Get computed styles for a pseudo-element
    function getComputedStylesForPseudoElement(element: Element, pseudoElement: string): Record<string, string> {
      const styles = window.getComputedStyle(element, `::${pseudoElement}`);
      const computedStyles: Record<string, string> = {};
      
      // Early existence check: ::before/::after only exist when content is not none/normal
      const contentValue = styles.getPropertyValue('content')?.trim();
      if (!contentValue || contentValue === 'none' || contentValue === 'normal') {
        return {};
      }
      
      // CSS properties that are commonly used with pseudo-elements
      const pseudoElementProperties = [
        // Content and display
        'content', 'display', 'position', 'visibility',
        
        // Layout
        'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
        'top', 'right', 'bottom', 'left', 'z-index',
        'float', 'clear', 'overflow',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        
        // Borders
        'border', 'border-width', 'border-style', 'border-color',
        'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
        'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
        'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
        'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
        'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
        
        // Typography (especially for ::first-line, ::first-letter)
        'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant',
        'line-height', 'text-align', 'text-decoration', 'text-transform',
        'letter-spacing', 'word-spacing', 'white-space', 'vertical-align',
        'color', 'text-shadow',
        
        // Background
        'background-color', 'background-image', 'background-repeat', 'background-position', 'background-size',
        
        // Visual effects
        'opacity', 'box-shadow', 'transform', 'transition', 'animation',
        
        // Flexbox and Grid (for layout pseudo-elements)
        'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
        'justify-content', 'align-items', 'align-content', 'align-self',
        'grid', 'grid-template', 'grid-area', 'grid-row', 'grid-column',
        
        // Other
        'cursor', 'outline', 'clip', 'clip-path', 'filter'
      ];
      
      // Get all computed styles for the pseudo-element
      for (const property of pseudoElementProperties) {
        const value = styles.getPropertyValue(property);
        
        // Skip empty or default values
        if (!value || value === '' || value === 'initial' || value === 'normal' || value === 'none') {
          continue;
        }
        
        // Special handling for content property (very important for ::before and ::after)
        if (property === 'content' && value !== 'none') {
          computedStyles[property] = value;
          continue;
        }

        // Apply filtering logic for specific properties
        let shouldInclude = true;

        // 1. If paddings are 0px, exclude those
        if (property.startsWith('padding') && value === '0px') {
          shouldInclude = false;
        }

        // 2. If margins are 0px, exclude those
        if (property.startsWith('margin') && value === '0px') {
          shouldInclude = false;
        }

        // 3. If display is not flex, remove all flex properties
        const displayValue = styles.getPropertyValue('display');
        if (property.startsWith('flex') && displayValue !== 'flex') {
          shouldInclude = false;
        }

        // 4. If min-width, min-height is 0px, exclude those
        if ((property === 'min-width' || property === 'min-height') && value === '0px') {
          shouldInclude = false;
        }

        // 5. If border radii are 0px, exclude those
        if ((property === 'border-top-left-radius' || property === 'border-top-right-radius' || 
             property === 'border-bottom-right-radius' || property === 'border-bottom-left-radius') && value === '0px') {
          shouldInclude = false;
        }

        // 6. If borders are 0px, exclude all corresponding border properties
        if (property === 'border-left-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-right-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-top-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-bottom-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border-width' && value === '0px') {
          shouldInclude = false;
        }
        if (property === 'border') {
          const borderWidth = styles.getPropertyValue('border-width');
          if (borderWidth === '0px') {
            shouldInclude = false;
          }
        }
        
        // Check border properties against their corresponding width values
        if (property === 'border-left') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-style') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-left-color') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right-color') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top-color') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-color') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-left-style') {
          const leftWidth = styles.getPropertyValue('border-left-width');
          if (leftWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-right-style') {
          const rightWidth = styles.getPropertyValue('border-right-width');
          if (rightWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-top-style') {
          const topWidth = styles.getPropertyValue('border-top-width');
          if (topWidth === '0px') {
            shouldInclude = false;
          }
        }
        if (property === 'border-bottom-style') {
          const bottomWidth = styles.getPropertyValue('border-bottom-width');
          if (bottomWidth === '0px') {
            shouldInclude = false;
          }
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // Outline: if outline-width is 0px, exclude outline-related properties
        if (property === 'outline-width' && value === '0px') {
          shouldInclude = false;
        }
        if ((property === 'outline' || property === 'outline-color') && styles.getPropertyValue('outline-width') === '0px') {
          shouldInclude = false;
        }

        // Animation: exclude default no-op value
        if (property === 'animation' && value.trim() === 'none 0s ease 0s 1 normal none running') {
          shouldInclude = false;
        }

        // Font defaults: exclude common defaults
        if (property === 'font-stretch' && value.trim() === '100%') {
          shouldInclude = false;
        }
        if (property === 'font-weight' && value.trim() === '400') {
          shouldInclude = false;
        }

        // 7. If display is not grid, exclude all grid related properties
        if (property.startsWith('grid') && displayValue !== 'grid') {
          shouldInclude = false;
        }

        // 8. Remove default browser values for common properties
        if (property === 'background-color' && value.trim() === 'rgba(0, 0, 0, 0)') {
          shouldInclude = false;
        }
        if (property === 'background-repeat' && value.trim() === 'repeat') {
          shouldInclude = false;
        }
        if (property === 'background-position' && value.trim() === '0% 0%') {
          shouldInclude = false;
        }
        if (property === 'overflow' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-x' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'overflow-y' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'opacity' && value.trim() === '1') {
          shouldInclude = false;
        }
        if (property === 'visibility' && value.trim() === 'visible') {
          shouldInclude = false;
        }
        if (property === 'text-align' && value.trim() === 'start') {
          shouldInclude = false;
        }
        if (property === 'text-decoration' && value.trim() === 'none solid rgb(255, 255, 255)') {
          shouldInclude = false;
        }
        if (property === 'text-indent' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'word-spacing' && value.trim() === '0px') {
          shouldInclude = false;
        }
        if (property === 'vertical-align' && value.trim() === 'baseline') {
          shouldInclude = false;
        }

        if (!shouldInclude) {
          continue;
        }
        
        // Include meaningful style overrides
        if (ENABLE_MEANINGFUL_STYLE_OVERRIDE) {
          if (isMeaningfulStyleOverride(property, value, element)) {
            computedStyles[property] = value;
          }
        } else {
          computedStyles[property] = value;
        }
      }
      
      return computedStyles;
    }

    // Generate the final HTML with style tag and body wrapper
    function generateFinalHTML(element: Element): string {
      const styleTag = generateStyleTag();
      const elementHTML = element.outerHTML;
      
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Captured Component</title>
  ${styleTag}
</head>
<body>
  ${elementHTML}
</body>
</html>`;
    }

    function generateSelector(element: Element): string | null {
      // Try to generate a unique selector for the element
      if (element.id) {
        return `#${element.id}`;
      }
      
      // Try to create a path-based selector using tag names and positions
      // This avoids issues with CSS classes that contain special characters
      const path: string[] = [];
      let current: Element | null = element;
      
      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        
        if (current.id) {
          selector = `#${current.id}`;
          path.unshift(selector);
          break;
        }
        
        // Add nth-child for positioning instead of relying on problematic class names
        const siblings = Array.from(current.parentNode?.children || []);
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-child(${index})`;
        }
        
        path.unshift(selector);
        current = current.parentNode as Element;
      }
      
      // Ensure the selector is not too long and is valid
      const finalSelector = path.join(' > ');
      if (finalSelector.length > 500) {
        // If selector is too long, fall back to a simpler approach
        return `${element.tagName.toLowerCase()}:nth-child(${Array.from(element.parentNode?.children || []).indexOf(element) + 1})`;
      }
      
      return finalSelector;
    }

    function isMeaningfulStyleOverride(property: string, value: string, element: Element): boolean {
      // Create a temporary element with the same tag name to get default styles
      const tempElement = document.createElement(element.tagName.toLowerCase());
      
      // Set all properties to initial to get true defaults
      tempElement.style.cssText = 'all: initial';
      
      // Temporarily add to DOM to get computed styles
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.pointerEvents = 'none';
      document.body.appendChild(tempElement);
      
      const defaultStyles = window.getComputedStyle(tempElement);
      const defaultValue = defaultStyles.getPropertyValue(property);
      
      // Clean up
      document.body.removeChild(tempElement);
      
      // Compare values, accounting for different formats
      return !isEquivalentValue(property, value, defaultValue);
    }

    function isEquivalentValue(property: string, value1: string, value2: string): boolean {
      // Normalize values for comparison
      const normalize = (val: string) => val.toLowerCase().trim();
      const norm1 = normalize(value1);
      const norm2 = normalize(value2);
      
      // Direct comparison
      if (norm1 === norm2) return true;
      
      // Handle common equivalent values
      const equivalents: Record<string, string[]> = {
        'color': ['rgb(0, 0, 0)', '#000000', 'black'],
        'background-color': ['rgba(0, 0, 0, 0)', 'transparent', 'initial'],
        'border': ['none', '0px none', 'initial'],
        'margin': ['0px', '0', 'initial'],
        'padding': ['0px', '0', 'initial'],
        'font-size': ['16px', 'medium', 'initial'],
        'font-weight': ['400', 'normal', 'initial'],
        'text-align': ['start', 'left', 'initial'],
        'display': ['inline', 'initial'],
        'position': ['static', 'initial'],
        'width': ['auto', 'initial'],
        'height': ['auto', 'initial']
      };
      
      const propertyEquivalents = equivalents[property];
      if (propertyEquivalents) {
        return propertyEquivalents.includes(norm1) && propertyEquivalents.includes(norm2);
      }
      
      return false;
    }

    function isMobileDevice(): boolean {
      // Check for touch capability and screen size
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      return hasTouch && (isSmallScreen || isMobileUserAgent);
    }

    function countTokens(text: string): number {
      try {
        // Use GPT-4 tokenizer (cl100k_base) for accurate token counting
        const encoder = encodingForModel('gpt-4');
        const tokens = encoder.encode(text);
        return tokens.length;
      } catch (error) {
        console.error('Error counting tokens:', error);
        Sentry.captureException(error);
        // Fallback: rough estimation (1 token ≈ 4 characters for English text)
        return Math.ceil(text.length / 4);
      }
    }

    async function cropScreenshot(dataUrl: string, rect: { left: number; top: number; width: number; height: number }): Promise<string> {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = rect.width;
          canvas.height = rect.height;
          
          if (ctx) {
            ctx.drawImage(
              img,
              rect.left, rect.top, rect.width, rect.height,
              0, 0, rect.width, rect.height
            );
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        
        img.onerror = reject;
        img.src = dataUrl;
      });
    }

    function showCaptureSuccess(captureId: string, tokenCount?: number) {
      // Create success notification
      const notification = document.createElement('div');
      notification.id = 'capture-success-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #52525b;
        color: #e4e4e7;
        padding: 20px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      `;
      
      const helpText = `Use the web-to-mcp tool with reference ${captureId} to implement the fetched website component.`;
      const warningHtml = tokenCount && tokenCount > 40000 ? `
        <div style="margin-bottom: 15px; padding: 10px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 4px;">
          <div style="font-size: 12px; color: #f59e0b; margin-bottom: 5px;">
            <span style="color: #d97706;">[WARNING]</span> Token count exceeds 40,000
          </div>
          <div style="font-size: 11px; color: rgba(245, 158, 11, 0.85);">
            The captured element is more than 40,000 tokens. Many code assistants may not handle such large context reliably. Consider selecting a smaller component.
          </div>
        </div>
      ` : '';
      const formattedTokenCount = typeof tokenCount === 'number' ? tokenCount.toLocaleString() : 'Unknown';
      
      notification.innerHTML = `
        <div style="margin-bottom: 15px;"><strong>Capture Successful</strong></div>
        
        ${warningHtml}
        <div style="margin-bottom: 15px;">
          <div style="font-size: 12px; color: #10b981; margin-bottom: 5px; font-weight: 500;">
            Reference ID
          </div>
          <div style="display: flex; gap: 5px; margin-bottom: 10px;">
            <input type="text" value="${captureId}" readonly style="
              flex: 1;
              padding: 5px 8px;
              font-size: 12px;
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 6px;
              background: rgba(10, 10, 10, 0.8);
              color: #e4e4e7;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
            <button id="copy-ref-id" style="
              padding: 5px 8px;
              font-size: 12px;
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 6px;
              background: rgba(16, 185, 129, 0.1);
              color: #10b981;
              cursor: pointer;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              white-space: nowrap;
              font-weight: 500;
            ">Copy</button>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-size: 12px; color: #06b6d4; margin-bottom: 5px; font-weight: 500;">
            Agent Instruction
          </div>
          <div style="display: flex; gap: 5px; margin-bottom: 10px;">
            <textarea readonly rows="3" style="
              flex: 1;
              padding: 5px 8px;
              font-size: 12px;
              border: 1px solid rgba(6, 182, 212, 0.3);
              border-radius: 6px;
              background: rgba(10, 10, 10, 0.8);
              color: #e4e4e7;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              resize: none;
              overflow-y: auto;
              scrollbar-width: none;
              -ms-overflow-style: none;
            ">${helpText}</textarea>
            <button id="copy-help-text" style="
              padding: 5px 8px;
              font-size: 12px;
              border: 1px solid rgba(6, 182, 212, 0.3);
              border-radius: 6px;
              background: rgba(6, 182, 212, 0.1);
              color: #06b6d4;
              cursor: pointer;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              white-space: nowrap;
              font-weight: 500;
            ">Copy</button>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button id="close-success-notification" style="
            flex: 1;
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 500;
          ">Close</button>
        </div>
      `;
      
      // Add CSS animation and scrollbar hiding
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* Hide scrollbar for webkit browsers */
        textarea::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Copy functionality
      let copyTimeout: NodeJS.Timeout;
      
      function showCopyFeedback(buttonId: string, originalText: string, feedbackText: string) {
        const button = document.getElementById(buttonId);
        if (button) {
          const originalContent = button.textContent;
          button.textContent = feedbackText;
          button.style.background = 'rgba(34, 197, 94, 0.3)';
          button.style.borderColor = '#22c55e';
          
          clearTimeout(copyTimeout);
          copyTimeout = setTimeout(() => {
            button.textContent = originalContent;
                      button.style.background = originalText.includes('HELP') ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)';
          button.style.borderColor = originalText.includes('HELP') ? 'rgba(6, 182, 212, 0.3)' : 'rgba(16, 185, 129, 0.3)';
          }, 2000);
        }
      }
      
      // Reference ID copy
      notification.querySelector('#copy-ref-id')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(captureId);
          showCopyFeedback('copy-ref-id', '[COPY]', '[COPIED!]');
        } catch (error) {
          console.error('Failed to copy reference ID:', error);
        }
      });
      
      // Help text copy
      notification.querySelector('#copy-help-text')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(helpText);
          showCopyFeedback('copy-help-text', '[COPY]', '[COPIED!]');
        } catch (error) {
          console.error('Failed to copy help text:', error);
        }
      });
      

      
      // Manual close button
      notification.querySelector('#close-success-notification')?.addEventListener('click', () => {
        notification.remove();
      });
    }

    function showCaptureError(error: any) {
      // Create error notification
      const notification = document.createElement('div');
      notification.id = 'capture-error-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 15px 20px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      `;
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      notification.innerHTML = `
        <div style="margin-bottom: 10px;">❌ <strong>Capture Failed</strong></div>
        <div style="font-size: 12px; opacity: 0.8;">
          ${errorMessage}
        </div>
        <button id="close-error-notification" style="
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          margin-top: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 500;
        ">Close</button>
      `;
      
      document.body.appendChild(notification);
      
      // Auto-hide after 8 seconds (longer for errors)
      setTimeout(() => {
        const notif = document.getElementById('capture-error-notification');
        if (notif) {
          notif.style.opacity = '0';
          notif.style.transition = 'opacity 0.5s ease';
          setTimeout(() => notif.remove(), 500);
        }
      }, 8000);
      
      // Manual close button
      notification.querySelector('#close-error-notification')?.addEventListener('click', () => {
        notification.remove();
      });
    }


  },
});
