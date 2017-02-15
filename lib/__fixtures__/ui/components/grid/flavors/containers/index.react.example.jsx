/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';

import CodeClass from 'app_modules/site/components/code-class';

export const preview = (
<div className="demo-only demo-container">
  <div className="slds-container--small">
    <div className="slds-box slds-box--small slds-theme--shade">Max Width: 480px</div>
  </div>
  <div className="slds-container--medium" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Max Width: 768px</div>
  </div>
  <div className="slds-container--large" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Max Width: 1024px</div>
  </div>
  <div className="slds-container--x-large" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Max Width: 1280px</div>
  </div>
  <div className="slds-container--fluid" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Width 100%</div>
  </div>
  <div className="slds-container--left slds-container--small" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Left Aligned</div>
  </div>
  <div className="slds-container--center slds-container--small" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Center Aligned</div>
  </div>
  <div className="slds-container--right slds-container--small" style={{marginTop: '1rem'}}>
    <div className="slds-box slds-box--small slds-theme--shade">Right Aligned</div>
  </div>
</div>
);

export const code = (
<div className="demo-only demo-container">
  <div className="slds-container--small">Contents go here.</div>
  <div className="slds-container--medium">Contents go here.</div>
  <div className="slds-container--large">Contents go here.</div>
  <div className="slds-container--x-large">Contents go here.</div>
  <div className="slds-container--fluid">Contents go here.</div>
  <div className="slds-container--left slds-container--small">Contents go here.</div>
  <div className="slds-container--center slds-container--small">Contents go here.</div>
  <div className="slds-container--right slds-container--small">Contents go here.</div>
</div>
);
