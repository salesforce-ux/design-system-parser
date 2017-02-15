/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';

export const preview = (
<div className="demo-only demo-container">
  <div className="slds-grid slds-grid--align-end slds-grid--pull-padded">
    <div className="slds-p-horizontal--small">
      <div className="slds-box slds-box--small slds-theme--shade slds-text-align--center">Content determines the width unless otherwise set</div>
    </div>
    <div className="slds-p-horizontal--small">
      <div className="slds-box slds-box--small slds-theme--shade slds-text-align--center">1</div>
    </div>
    <div className="slds-p-horizontal--small">
      <div className="slds-box slds-box--small slds-theme--shade slds-text-align--center">2</div>
    </div>
    <div className="slds-p-horizontal--small">
      <div className="slds-box slds-box--small slds-theme--shade slds-text-align--center">3</div>
    </div>
  </div>
</div>
);

export const code = (
<div className="demo-only demo-container">
  <div className="slds-grid slds-grid--align-end">
    <div>Content determines the width unless otherwise set</div>
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>
</div>
);
